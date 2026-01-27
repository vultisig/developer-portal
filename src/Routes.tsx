import { FC, ReactNode } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { useCore } from "@/hooks/useCore";
import { DefaultLayout } from "@/layouts/Default";
import { AcceptInvitePage } from "@/pages/AcceptInvite";
import { EarningsPage } from "@/pages/Earnings";
import { NewPluginPage } from "@/pages/NewPlugin";
import { NotFoundPage } from "@/pages/NotFound";
import { PluginEditPage } from "@/pages/PluginEdit";
import { PluginsPage } from "@/pages/Plugins";
import { routeTree } from "@/utils/routes";

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { vault } = useCore();

  return !vault ? <Navigate to={routeTree.root.path} replace /> : children;
};

export const Routes = () => {
  const router = createBrowserRouter([
    {
      path: routeTree.root.path,
      element: <DefaultLayout />,
      children: [
        { index: true, element: <Navigate to={routeTree.plugins.path} replace /> },
        { path: routeTree.plugins.path, element: <PluginsPage /> },
        {
          path: routeTree.pluginEdit.path,
          element: (
            <ProtectedRoute>
              <PluginEditPage />
            </ProtectedRoute>
          ),
        },
        { path: routeTree.earnings.path, element: <EarningsPage /> },
        { path: routeTree.newPlugin.path, element: <NewPluginPage /> },
        { path: routeTree.acceptInvite.path, element: <AcceptInvitePage /> },
      ],
    },
    { path: routeTree.notFound.path, element: <NotFoundPage /> },
  ]);

  return <RouterProvider router={router} />;
};
