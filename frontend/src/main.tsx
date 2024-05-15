import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import SectionLayout from "./routes/SectionLayout";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import TaskAccordion from "./routes/TaskAccordion";
import config from "./config";

const theme = createTheme({});
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <SectionLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <TaskAccordion filter={{ status: ["todo"] }} />,
      },
      {
        path: "laari/:unit?",
        element: <TaskAccordion filter={{ status: ["todo"] }} />,
      },
      {
        path: "jono/:unit?",
        element: <TaskAccordion filter={{ status: ["in progress"] }} />,
      },
      {
        path: "maali/:unit?",
        element: <TaskAccordion filter={{ status: ["done"] }} />,
      },
    ],
  },
]);

console.log("ENV", process.env.NODE_ENV);
console.log("PRIVATE ENV", process.env.RAILWAY_BACKEND_PRIVATE_DOMAIN);
console.log("PRIVATE ENV", process.env.RAILWAY_BACKEND_PUBLIC_DOMAIN);
console.log("PRIVATE", config.RAILWAY_BACKEND_PRIVATE_DOMAIN);
console.log("PRIVATE", config.RAILWAY_BACKEND_PUBLIC_DOMAIN);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>
      <ReactQueryDevtools client={queryClient} />
    </QueryClientProvider>
  </React.StrictMode>
);
