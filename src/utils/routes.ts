type RouteKey =
  | "account"
  | "notFound"
  | "projectCategories"
  | "projectManagement"
  | "root";

export const routeTree = {
  account: { path: "/account" },
  notFound: { path: "*" },
  projectCategories: {
    path: "/account/projects/:projectId/categories",
    link: (projectId: string) => `/account/projects/${projectId}/categories`,
  },
  projectManagement: {
    path: `/account/projects/:projectId`,
    link: (projectId: string) => `/account/projects/${projectId}`,
  },
  root: { path: "/" },
} satisfies Record<
  RouteKey,
  { path: string; link?: (...args: string[]) => string }
>;
