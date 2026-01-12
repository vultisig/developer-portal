type RouteKey =
  | "plugins"
  | "pluginEdit"
  | "earnings"
  | "newPlugin"
  | "notFound"
  | "root";

export const routeTree = {
  plugins: { path: "/plugins" },
  pluginEdit: {
    link: (id: string) => `/plugins/${id}/edit`,
    path: "/plugins/:id/edit",
  },
  earnings: { path: "/earnings" },
  newPlugin: { path: "/new-plugin" },
  notFound: { path: "*" },
  root: { path: "/" },
} satisfies Record<
  RouteKey,
  { path: string; link?: (...args: string[]) => string }
>;
