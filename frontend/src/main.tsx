import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import axios from "axios";
import Tasks from "./routes/Tasks";

async function taskLoader() {
  const [tasks, users, channels] = await Promise.all([
    axios
      .get("https://laari.up.railway.app/tasks")
      .then((response) => response.data),
    axios
      .get("https://laari.up.railway.app/users")
      .then((response) => response.data),
    axios
      .get("https://laari.up.railway.app/channels")
      .then((response) => response.data),
  ]);
  return { tasks, users, channels };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Tasks />,
    errorElement: <ErrorPage />,
    loader: taskLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
