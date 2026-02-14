export const defaultPageSize = 12;

export const modalHash = {
  automation: "#automation",
  currency: "#currency",
  language: "#language",
  payment: "#payment",
  report: "#report",
  requirements: "#requirements",
  success: "#success",
  review: "#review",
} as const;

export const feeAppId: string = import.meta.env.VITE_FEE_APP_ID;
export const portalApiUrl: string = import.meta.env.VITE_DEVELOPER_PORTAL_URL;
export const vultiApiUrl: string = import.meta.env.VITE_VULTISIG_SERVER;
