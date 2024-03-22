import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import { useEffect, useRef } from "react";
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

const App = () => {
  const checking = useRef(false);
  useEffect(() => {
    if (checking.current) return;
    checking.current = true;
    (async () => {
      const update = await check();
      if (update) {
        await update.downloadAndInstall();
        await relaunch();
      }
    })();
  }, []);
  return (
    <div className="dark">
      <div className="dark:text-gray-200 dark:bg-gray-800">
        <RouterProvider router={router} />
      </div>
    </div>
  );
};

export default App;
