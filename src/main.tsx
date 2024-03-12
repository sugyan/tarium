import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./routes/home";
import Root from "./routes/root";
import Signin from "./routes/signin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    path: "/signin",
    element: <Signin />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="dark">
      <div className=" dark:text-gray-300 dark:bg-gray-800">
        <RouterProvider router={router} />
      </div>
    </div>
  </React.StrictMode>
);
