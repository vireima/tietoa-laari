import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import axios from "axios";

function taskLoader() {
  return axios.get("https://laari.up.railway.app/tasks");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello w!</div>,
    errorElement: <ErrorPage />,
    loader: taskLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
