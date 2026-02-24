export type RouteKey =
  | "account"
  | "earnings"
  | "notFound"
  | "plugins"
  | "pluginCreate"
  | "pluginEarnings"
  | "pluginMembers"
  | "pluginUpdate"
  | "proposals"
  | "proposalCreate"
  | "proposalUpdate"
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
  pluginMembers: {
    path: "/plugins/:pluginId/members",
    link: (pluginId: string) => `/plugins/${pluginId}/members`,
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
  proposals: { path: "/proposals" },
  proposalCreate: { path: "/proposals/create" },
  proposalUpdate: {
    path: "/proposals/:pluginId",
    link: (pluginId: string) => `/proposals/${pluginId}`,
  },
  root: { path: "/" },
  users: { path: "/users" },
} satisfies Record<
  RouteKey,
  { path: string; link?: (...args: string[]) => string }
>;
