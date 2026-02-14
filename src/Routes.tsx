import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthLayout } from "@/layouts/Auth";
import { DefaultLayout } from "@/layouts/Default";
import { ConnectPage } from "@/pages/Connect";
import { InternalErrorPage } from "@/pages/InternalError";
import { MainPage } from "@/pages/Main";
import { NotFoundPage } from "@/pages/NotFound";
import { ProjectCategoriesPage } from "@/pages/ProjectCategories";
import { ProjectManagementPage } from "@/pages/ProjectManagement";
import { routeTree } from "@/utils/routes";

export const Routes = () => {
  const router = createBrowserRouter([
    {
      path: routeTree.root.path,
      element: <DefaultLayout />,
      children: [{ index: true, element: <MainPage /> }],
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
