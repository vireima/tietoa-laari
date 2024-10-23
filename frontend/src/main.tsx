import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
// import SectionLayout from "./routes/SectionLayout";
import {
  Anchor,
  colorsTuple,
  createTheme,
  // MantineColorsTuple,
  MantineProvider,
  ThemeIcon,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import TaskAccordion from "./routes/TaskAccordion";
import config from "./config";
import { CookiesProvider } from "react-cookie";
// import SingleTask from "./routes/SingleTask";
import TasklistLayout from "./routes/TasklistLayout";
import Tasklist from "./components/Tasklist";
import Auth from "./routes/Auth";

// const primary: MantineColorsTuple = [
//   "#C0CED3",
//   "#AEBFC7",
//   "#9CB0BA",
//   "#7892A1",
//   "#8bac94",
//   "#668393",
//   "#5A7281",
//   "#4D626F",
//   "#41515D",
//   "#34414B",
// ];

const theme = createTheme({
  colors: {
    primary: colorsTuple("#35424c"),
  },
  primaryColor: "primary",
  primaryShade: 9,
  // white: "#eeeef0",
  components: {
    ThemeIcon: ThemeIcon.extend({ defaultProps: { variant: "transparent" } }),
    Anchor: Anchor.extend({ defaultProps: { underline: "always" } }),
  },
});
const queryClient = new QueryClient();

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <SectionLayout />,
  //   errorElement: <ErrorPage />,
  //   children: [
  //     {
  //       index: true,
  //       element: <TaskAccordion filter={{ status: ["todo"] }} />,
  //     },
  //     {
  //       path: "laari/:unit?",
  //       element: <TaskAccordion filter={{ status: ["todo"] }} />,
  //     },
  //     {
  //       path: "jono/:unit?",
  //       element: <TaskAccordion filter={{ status: ["in progress"] }} />,
  //     },
  //     {
  //       path: "maali/:unit?",
  //       element: <TaskAccordion filter={{ status: ["done"] }} />,
  //     },
  //     {
  //       path: "arkisto",
  //       element: <TaskAccordion filter={{ archived: true }} />,
  //     },
  //     {
  //       path: ":channel/:ts",
  //       element: <SingleTask />,
  //     },
  //   ],
  // },
  {
    path: "/",
    element: <TasklistLayout />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <Tasklist /> }],
  },
  {
    path: "/login",
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
]);

console.log("ENV", process.env.NODE_ENV);
console.log("API_URL", config.API_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        {/* <Notifications> */}
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <RouterProvider router={router} />
        </CookiesProvider>
        {/* </Notifications> */}
      </MantineProvider>
      <ReactQueryDevtools client={queryClient} />
    </QueryClientProvider>
  </React.StrictMode>
);
