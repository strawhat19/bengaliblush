# User Role Quick Edit

The Users table saves role changes through `src/api/owner.ts` and `updateUserRole` in `src/shared/firebase/owner.ts`. Supported roles remain Subscriber, Admin, and Owner. The save transaction re-reads the signed-in account mapping, active Owner record, and target User. Owners cannot change their own role or a deleting account's role; an unchanged selection creates no write.

Each committed change atomically updates only the target's `role` and `updated_at`, creates an immutable `roleChanges/RoleChange_Number_UserRole_Date_UUID` record, and increments `counters/roleChanges`. Audit fields are `id`, matching integer `number`, `actor_id`, `actor_firebase_uid`, `target_id`, `previous_role`, `next_role`, and server timestamp `created_at`. Audit reads and its counter are Owner-only; lists require a limit of at most 100. No audit UI or additional query/index is introduced.

The Rules require the new audit and matching counter for every role mutation, reject self-role changes, validate both roles and the exact audit shape, and link the audit's before/after values to the real target update. The actor must remain an active Owner after the atomic operation. Existing profile fields and account lifecycle actions retain their current behavior; this does not change independent account deactivation/deletion policies.

Source review considered unauthenticated/Admin role writes, self-demotion, missing/replayed audits, counter-only writes, forged actor/target/before/after fields, audit updates/deletes, schema/type/size violations, mixed role/profile edits, and forged timestamps. The added predicates reject those cases by inspection. Existing User reads retain their authorized Admin/Owner boundary and audit records expose no emails or credentials. Nested paths remain denied by default.

No tests, builds, emulator, Rules syntax validation, UI checks, deployment, or live-cloud verification were run, following the project instruction to leave verification to the user. Deploy the updated Rules together with the client change to enforce the new atomic audit boundary in the connected project.
