import { LoaderFunctionArgs, RouteObject, redirect } from "react-router-dom";
import Home from "./public/home";
import Login from "./auth/login";
import { Callback } from "./auth/callback";
import RootErrorBoundary from "@/components/RootErrorBoundry";
import AppLayout from "@/components/AppLayout";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    loader: Home.loader,
    errorElement: <RootErrorBoundary />,
  },
  {
    element: <AppLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: "/applications/:applicationId",
        element: <div>Application</div>,
        loader: ({ params }: LoaderFunctionArgs) => {
          //check if user is logged in
          const raw = localStorage.getItem("user");
          if (!raw) {
            return redirect(`/applications/${params.applicationId}/login`);
          }
          return null;
        },
      },
      {
        path: "/applications/:applicationId/login",
        element: <Login />,
        action: Login.action,
      },
      {
        path: "/applications/:applicationId/callback",
        element: <Callback />,
      },
    ],
  },
];
