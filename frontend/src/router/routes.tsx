// src/router/routes.tsx

import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import Root from "../Components/Root/Root";
import Home from "../Components/Home/Home";
import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";
import Profile from "../Components/Profile/Profile";
import MoviePage from "../Components/MoviePage/MoviePage";
import ForgetPasswordPage from "../Components/ForgetPasswordPage/ForgetPasswordPage";
import ResetPasswordPage from "../Components/ResetPasswordPage/ResetPasswordPage";

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
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/:id",
        element: <MoviePage />,
      },
      {
        path: "/forget-password",
        element: <ForgetPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      }
    ],
  },
]);
