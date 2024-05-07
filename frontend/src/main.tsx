import React from "react";
import ReactDOM from "react-dom/client";
// import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import Tasks from "./routes/Tasks";
import Layout from "./routes/Layout";
import { tasksLoader } from "./api/Tasks.loader";
import { editTasksAction } from "./api/Tasks.action";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

const theme = createTheme({});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Tasks />,
        loader: tasksLoader,
        action: editTasksAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} forceColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
