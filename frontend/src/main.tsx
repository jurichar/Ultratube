// frontend/src/App.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "../src/router/routes.tsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ContextProvider } from "./context/context.tsx";
import './i18n/i18n.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
