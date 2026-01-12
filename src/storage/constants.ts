export const storageKeys = {
  theme: "theme",
  token: "token",
  vaultId: "vaultId",
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
