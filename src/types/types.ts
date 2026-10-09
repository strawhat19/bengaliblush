export enum Roles {
  Admin = `admin`,
  Owner = `owner`,
  Subscriber = `subscriber`,
}

export const roleLabels: Record<Roles, string> = {
  [Roles.Admin]: `Admin`,
  [Roles.Owner]: `Owner`,
  [Roles.Subscriber]: `Subscriber`,
};

export const hasAdminAccess = (role?: Roles | string) => role === Roles.Admin || role === Roles.Owner;
