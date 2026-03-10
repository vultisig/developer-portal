const managerRoles = ["admin", "staff"] as const;
export const memberRoles = ["editor", "viewer"] as const;
export const roles = [...managerRoles, ...memberRoles] as const;

export type Role = (typeof roles)[number];
