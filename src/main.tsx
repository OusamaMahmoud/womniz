import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ContextProvider } from "./contexts/ContextProvider.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoadingProvider } from "./contexts/LoadingContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ContextProvider>
          <LoadingProvider>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
              <ReactQueryDevtools />
            </QueryClientProvider>
          </LoadingProvider>
        </ContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
