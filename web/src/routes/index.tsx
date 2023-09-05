import {
  LoaderFunctionArgs,
  Outlet,
  RouteObject,
  redirect,
} from "react-router-dom";
import Home from "./public/home";
import Login from "./auth/login";
import { Callback } from "./auth/callback";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    loader: Home.loader,
  },
  {
    element: <Outlet />,
    children: [
      {
        path: "/applications/:applicationId",
        element: <div>Application</div>,
        loader: ({ params }: LoaderFunctionArgs) => {
          // get user from local1 storage
          // if user is not logged in, redirect to login page
          // else, return user

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
