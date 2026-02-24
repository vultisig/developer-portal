import { FC, ReactNode, useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { useApp } from "@/hooks/useApp";
import { useCore } from "@/hooks/useCore";
import { AuthLayout } from "@/layouts/Auth";
import { DefaultLayout } from "@/layouts/Default";
import { ConnectPage } from "@/pages/Connect";
import { DashboardPage } from "@/pages/Dashboard";
import { EarningsPage } from "@/pages/Earnings";
import { InternalErrorPage } from "@/pages/InternalError";
import { NotFoundPage } from "@/pages/NotFound";
import { PluginEarningsPage } from "@/pages/PluginEarnings";
import { PluginManagementPage } from "@/pages/PluginManagement";
import { PluginsPage } from "@/pages/Plugins";
import { ProjectCategoriesPage } from "@/pages/ProjectCategories";
import { ProjectManagementPage } from "@/pages/ProjectManagement";
import { UsersPage } from "@/pages/Users";
import { RouteKey, routeTree } from "@/utils/routes";

const SetCurrentRoute: FC<{ route: RouteKey; children: ReactNode }> = ({
  route,
  children,
}) => {
  const { setCurrentRoute } = useCore();

  useEffect(() => {
    setCurrentRoute(route);
  }, [route, setCurrentRoute]);

  return children;
};

const setCurrentRoute = (route: RouteKey, element: ReactNode) => (
  <SetCurrentRoute route={route}>{element}</SetCurrentRoute>
);

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { vault } = useApp();

  return !vault ? <Navigate to={routeTree.account.path} replace /> : children;
};

export const Routes = () => {
  const router = createBrowserRouter([
    {
      path: routeTree.root.path,
      element: (
        <ProtectedRoute>
          <DefaultLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: setCurrentRoute("root", <DashboardPage />) },
        {
          path: routeTree.earnings.path,
          element: setCurrentRoute("earnings", <EarningsPage />),
        },
        {
          path: routeTree.plugins.path,
          element: setCurrentRoute("plugins", <PluginsPage />),
        },
        {
          path: routeTree.pluginCreate.path,
          element: setCurrentRoute("pluginCreate", <PluginManagementPage />),
        },
        {
          path: routeTree.pluginUpdate.path,
          element: setCurrentRoute("pluginUpdate", <PluginManagementPage />),
        },
        {
          path: routeTree.pluginEarnings.path,
          element: setCurrentRoute("pluginEarnings", <PluginEarningsPage />),
        },
        {
          path: routeTree.users.path,
          element: setCurrentRoute("users", <UsersPage />),
        },
      ],
      errorElement: <InternalErrorPage />,
    },
    {
      path: routeTree.account.path,
      element: <AuthLayout />,
      children: [
        { index: true, element: <ConnectPage /> },
        {
          path: routeTree.projectCategories.path,
          element: <ProjectCategoriesPage />,
        },
        {
          path: routeTree.projectManagement.path,
          element: <ProjectManagementPage />,
        },
      ],
      errorElement: <InternalErrorPage />,
    },
    { path: routeTree.notFound.path, element: <NotFoundPage /> },
  ]);

  return <RouterProvider router={router} />;
};
