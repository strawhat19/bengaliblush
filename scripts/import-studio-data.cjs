const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const projectRoot = path.resolve(__dirname, `..`);
const expectedProject = `bengaliblush-9ac28`;
const projectRequire = createRequire(path.join(projectRoot, `package.json`));
const moduleCache = new Map();
const collections = {
  reviews: `Review`,
  products: `Product`,
  services: `Service`,
  notifications: `Notification`,
};

class ImportError extends Error {}

const requestFailure = (error) => {
  const status = Number.isInteger(error?.status) ? ` HTTP ${error.status}` : ``;
  const reason = error?.context?.body?.error?.status;
  return `${status}${typeof reason === `string` && /^[A-Z_]+$/.test(reason) ? ` ${reason}` : ``}`;
};

const loadSource = (filename) => {
  const absolutePath = path.resolve(projectRoot, filename);
  if (moduleCache.has(absolutePath)) return moduleCache.get(absolutePath).exports;
  const module = { exports: {} };
  moduleCache.set(absolutePath, module);
  const { transpileModule, ModuleKind, ScriptTarget } = projectRequire(`typescript`);
  const source = transpileModule(fs.readFileSync(absolutePath, `utf8`), {
    compilerOptions: { target: ScriptTarget.ES2020, module: ModuleKind.CommonJS },
  }).outputText;
  const scopedRequire = createRequire(absolutePath);
  const requireSource = (specifier) => {
    if (!specifier.startsWith(`@/`) && !specifier.startsWith(`.`)) return scopedRequire(specifier);
    const base = specifier.startsWith(`@/`)
      ? path.join(projectRoot, `src`, specifier.slice(2))
      : path.resolve(path.dirname(absolutePath), specifier);
    const resolved = [base, `${base}.ts`, `${base}.tsx`, path.join(base, `index.ts`)]
      .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!resolved) throw new ImportError(`A Studio Source Module Was Not Found`);
    return loadSource(resolved);
  };
  new Function(`require`, `module`, `exports`, `__filename`, `__dirname`, source)(
    requireSource, module, module.exports, absolutePath, path.dirname(absolutePath),
  );
  return module.exports;
};

const getSeeds = () => {
  const { services } = loadSource(`src/shared/services/service-content.ts`);
  const { createRecordId } = loadSource(`src/shared/firebase/records.ts`);
  const { productCategories } = loadSource(`src/shared/shop/shop-content.ts`);
  const { sampleTestimonials } = loadSource(`src/shared/reviews/review-content.ts`);
  const { normalizeNotification } = loadSource(`src/shared/firebase/notifications.ts`);
  const { sampleNotifications } = loadSource(`src/shared/notifications/notification-content.ts`);
  const { normalizeProduct, normalizeService, normalizeReview } = loadSource(`src/shared/firebase/commerce-records.ts`);
  return {
    createRecordId,
    seeds: {
      products: productCategories.flatMap((category) => category.products.map(({ id, ...product }) =>
        normalizeProduct({ ...product, slug: id, category_id: category.id, category_name: category.name, status: `active` }))),
      services: services.map(({ id, number, ...service }) => normalizeService({ ...service, legacy_id: id, status: `active` })),
      reviews: [...sampleTestimonials].reverse().map(({ id, ...review }) => normalizeReview({ ...review, status: `published` })),
      notifications: sampleNotifications.map(normalizeNotification),
    },
  };
};

const decodeValue = (value) => {
  if (`nullValue` in value) return null;
  if (`stringValue` in value) return value.stringValue;
  if (`booleanValue` in value) return value.booleanValue;
  if (`integerValue` in value) return Number(value.integerValue);
  if (`doubleValue` in value) return value.doubleValue;
  if (`timestampValue` in value) return value.timestampValue;
  if (`arrayValue` in value) return (value.arrayValue.values ?? []).map(decodeValue);
  if (`mapValue` in value) return decodeFields(value.mapValue.fields ?? {});
  throw new ImportError(`Existing Studio Data Has An Unsupported Field`);
};

const decodeFields = (fields) => Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));

const encodeValue = (value) => {
  if (value === null) return { nullValue: null };
  if (typeof value === `string`) return { stringValue: value };
  if (typeof value === `boolean`) return { booleanValue: value };
  if (typeof value === `number`) return Number.isSafeInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (value && typeof value === `object`) return { mapValue: { fields: encodeFields(value) } };
  throw new ImportError(`Studio Content Has An Unsupported Field`);
};

const encodeFields = (fields) => Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, encodeValue(value)]));

const validIdentity = (type, id, number) => Number.isSafeInteger(number) && number > 0 && typeof id === `string`
  && new RegExp(`^${type}_${number}_[A-Za-z0-9]+_[A-Za-z0-9_]+_[a-f0-9-]+$`).test(id);

const getFirebaseTools = () => {
  const searchPaths = [projectRoot, ...(process.env.APPDATA ? [path.join(process.env.APPDATA, `npm`, `node_modules`)] : [])];
  let cliRoot;
  try { cliRoot = path.dirname(require.resolve(`firebase-tools/package.json`, { paths: searchPaths })); }
  catch { throw new ImportError(`Install Firebase CLI And Run Firebase Login First`); }
  return (filename) => require(path.join(cliRoot, `lib`, filename));
};

const parseArguments = () => {
  const argumentsList = process.argv.slice(2);
  let project = JSON.parse(fs.readFileSync(path.join(projectRoot, `.firebaserc`), `utf8`))?.projects?.default;
  let apply = false;
  for (let index = 0; index < argumentsList.length; index += 1) {
    if (argumentsList[index] === `--apply`) apply = true;
    else if (argumentsList[index] === `--project`) project = argumentsList[++index];
    else throw new ImportError(`Use --apply And Optional --project ${expectedProject}`);
  }
  if (project !== expectedProject) throw new ImportError(`This Import Only Supports ${expectedProject}`);
  return { apply, project };
};

const run = async () => {
  const { apply, project } = parseArguments();
  const { seeds, createRecordId } = getSeeds();
  const firebaseTools = getFirebaseTools();
  const auth = firebaseTools(`auth.js`);
  const { Client } = firebaseTools(`apiv2.js`);
  const { requireAuth } = firebaseTools(`requireAuth.js`);
  const { firestoreOrigin } = firebaseTools(`api.js`);
  const options = { project, nonInteractive: true };
  const account = auth.getProjectDefaultAccount(projectRoot);
  if (account) auth.setActiveAccount(options, account);
  try { await requireAuth(options); }
  catch { throw new ImportError(`Firebase Login Is Required`); }
  const client = new Client({ auth: true, apiVersion: `v1`, urlPrefix: firestoreOrigin() });
  const databasePath = `projects/${project}/databases/(default)`;
  const documentsPath = `${databasePath}/documents`;
  const requestOptions = () => ({ retries: 0, skipLog: { body: true, resBody: true } });
  const listDocuments = async (collectionName) => {
    const documents = [];
    let pageToken;
    do {
      let response;
      try {
        response = await client.get(`${documentsPath}/${collectionName}`, {
          ...requestOptions(), queryParams: { pageSize: 1000, ...(pageToken ? { pageToken } : {}) },
        });
      } catch (error) { throw new ImportError(`Could Not Read ${collectionName}${requestFailure(error)}`); }
      documents.push(...(response.body?.documents ?? []).map((document) => ({
        ...document, data: decodeFields(document.fields ?? {}), key: document.name.split(`/`).at(-1),
      })));
      pageToken = response.body?.nextPageToken;
    } while (pageToken);
    return documents;
  };
  const collectionNames = [...Object.keys(collections), `counters`, `catalogSlugs`];
  const snapshots = await Promise.all(collectionNames.map(listDocuments));
  const existing = Object.fromEntries(collectionNames.map((name, index) => [name, snapshots[index]]));
  const slugReservations = new Map(existing.catalogSlugs.map((document) => [document.key, document.data]));
  const summary = {};
  const writes = [];
  for (const [collectionName, type] of Object.entries(collections)) {
    const records = existing[collectionName];
    for (const record of records) {
      if (record.data.id !== record.key || !validIdentity(type, record.key, record.data.number)) {
        throw new ImportError(`Existing ${collectionName} IDs Or Numbers Need Attention`);
      }
    }
    if (new Set(records.map((record) => record.data.number)).size !== records.length) {
      throw new ImportError(`Existing ${collectionName} Numbers Are Duplicated`);
    }
    const counter = existing.counters.find((document) => document.key === collectionName);
    if (counter && (!validIdentity(type, counter.data.record_id, counter.data.number)
      || Object.keys(counter.data).sort().join(`,`) !== `number,record_id`)) {
      throw new ImportError(`Existing ${collectionName} Counter Needs Attention`);
    }
    let number = Math.max(counter?.data?.number ?? 0, ...records.map((record) => record.data.number));
    let lastId;
    const prepared = records.map((record) => record.data);
    summary[collectionName] = { existing: records.length, add: 0, skip: 0 };
    for (const seed of seeds[collectionName]) {
      const duplicate = collectionName === `reviews`
        ? prepared.some((record) => (record.name === seed.name && record.service === seed.service) || record.quote === seed.quote)
        : prepared.some((record) => record.slug === seed.slug);
      if (duplicate) { summary[collectionName].skip += 1; continue; }
      const slugKey = seed.slug ? `${collectionName}_${seed.slug}` : null;
      if (slugKey && slugReservations.has(slugKey)) throw new ImportError(`An Existing ${collectionName} Slug Needs Attention`);
      number += 1;
      if (!Number.isSafeInteger(number)) throw new ImportError(`The ${collectionName} Counter Is Too Large`);
      const id = createRecordId(type, number, seed.name ?? seed.title);
      if (!validIdentity(type, id, number)) throw new ImportError(`A Generated Studio ID Is Invalid`);
      const values = { ...seed, id, number };
      writes.push({
        currentDocument: { exists: false },
        update: { name: `${documentsPath}/${collectionName}/${id}`, fields: encodeFields(values) },
        updateTransforms: [
          { fieldPath: `created_at`, setToServerValue: `REQUEST_TIME` },
          { fieldPath: `updated_at`, setToServerValue: `REQUEST_TIME` },
        ],
      });
      if (slugKey) {
        const reservation = { slug: seed.slug, record_id: id, collection_name: collectionName };
        writes.push({ currentDocument: { exists: false }, update: { name: `${documentsPath}/catalogSlugs/${slugKey}`, fields: encodeFields(reservation) } });
        slugReservations.set(slugKey, reservation);
      }
      prepared.push(values);
      summary[collectionName].add += 1;
      lastId = id;
    }
    if (lastId) writes.push({
      currentDocument: counter ? { updateTime: counter.updateTime } : { exists: false },
      update: { name: `${documentsPath}/counters/${collectionName}`, fields: encodeFields({ number, record_id: lastId }) },
    });
  }
  if (!apply || !writes.length) {
    console.log(JSON.stringify({ project, mode: apply ? `No Changes` : `Dry Run`, collections: summary, writes: writes.length }));
    return;
  }
  let response;
  try { response = await client.post(`${documentsPath}:commit`, { writes }, requestOptions()); }
  catch { throw new ImportError(`Import Result Is Uncertain; Rerun Without --apply And Review Saved Records Before Retrying`); }
  if (response.body?.writeResults?.length !== writes.length) {
    throw new ImportError(`Import Result Needs Review; Rerun Without --apply Before Retrying`);
  }
  console.log(JSON.stringify({ project, mode: `Applied`, collections: summary, writes: writes.length }));
};

run().catch((error) => {
  console.error(error instanceof ImportError ? error.message : `Studio Import Failed; Check Source Content And Firebase Setup`);
  process.exitCode = 1;
});
