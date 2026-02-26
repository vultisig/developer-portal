export const modalHash = {
  currency: "#currency",
  form: "#form",
  success: "#success",
} as const;

export const earningStatuses = ["completed", "failed", "pending"] as const;
export const earningTypes = ["once", "per-tx", "recurring"] as const;

export const portalApiUrl: string = import.meta.env.VITE_DEVELOPER_PORTAL_URL;
export const vultiApiUrl: string = import.meta.env.VITE_VULTISIG_SERVER;
