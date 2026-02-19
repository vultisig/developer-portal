export type RouteKey =
  | "account"
  | "earnings"
  | "notFound"
  | "plugins"
  | "pluginCreate"
  | "pluginUpdate"
  | "pluginTransactions"
  | "projectCategories"
  | "projectManagement"
  | "root"
  | "users";

export const routeTree = {
  account: { path: "/account" },
  earnings: { path: "/earnings" },
  notFound: { path: "*" },
  plugins: { path: "/plugins" },
  pluginCreate: { path: "/plugins/create" },
  pluginUpdate: {
    path: "/plugins/:pluginId",
    link: (pluginId: string) => `/plugins/${pluginId}`,
  },
  pluginTransactions: {
    path: "/plugins/:pluginId/transactions",
    link: (pluginId: string) => `/plugins/${pluginId}/transactions`,
  },
  projectCategories: {
    path: "/account/projects/:projectId/categories",
    link: (projectId: string) => `/account/projects/${projectId}/categories`,
  },
  projectManagement: {
    path: `/account/projects/:projectId`,
    link: (projectId: string) => `/account/projects/${projectId}`,
  },
  root: { path: "/" },
  users: { path: "/users" },
} satisfies Record<
  RouteKey,
  { path: string; link?: (...args: string[]) => string }
>;
