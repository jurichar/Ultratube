// src/router/routes.tsx

import { LoaderFunctionArgs, createBrowserRouter, redirect } from "react-router-dom";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import Root from "../Components/Root/Root";
import Home from "../Components/Home/Home";
import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";
import Profile from "../Components/Profile/Profile";
import MoviePage from "../Components/MoviePage/MoviePage";
import { useAuth } from "../context/context";
import { useContext } from "react";
import ProtectedRoute from "./protectedRoutes";
import UnAuthenticateRoutes from "./UnAuthenticateRoutes";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <UnAuthenticateRoutes>
            <Login />
          </UnAuthenticateRoutes>
        ),
      },
      {
        path: "/register",
        element: (
          <UnAuthenticateRoutes>
            <Register />
          </UnAuthenticateRoutes>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/movie/:id",
        element: <MoviePage />,
      },
    ],
  },
]);
