import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import CssBaseline from "@mui/material/CssBaseline";
import { Navigate, RouterProvider, createHashRouter } from "react-router-dom";
import { MainPage, TestSessionsListPage } from "./pages";

const router = createHashRouter([
  {
    path: "/",
    element: <Navigate to="/sessions" />,
  },
  {
    path: "/sessions",
    element: <TestSessionsListPage />,
  },
  {
    path: "/sessions/:sessionId",
    element: <MainPage />,
  },
]);

export const App = () => {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  );
};
