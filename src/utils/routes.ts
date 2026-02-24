export type RouteKey =
  | "account"
  | "earnings"
  | "notFound"
  | "plugins"
  | "pluginCreate"
  | "pluginEarnings"
  | "pluginUpdate"
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
  pluginEarnings: {
    path: "/plugins/:pluginId/earnings",
    link: (pluginId: string) => `/plugins/${pluginId}/earnings`,
  },
  pluginUpdate: {
    path: "/plugins/:pluginId",
    link: (pluginId: string) => `/plugins/${pluginId}`,
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
