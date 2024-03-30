import { listen } from "@tauri-apps/api/event";
import { message } from "@tauri-apps/plugin-dialog";
import { check } from "@tauri-apps/plugin-updater";
import { useEffect, useRef } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { EVENT_MENU_RELOAD } from "./constants";
import "./index.css";
import FeedGenerator from "./routes/feed-generator";
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
      {
        path: "/feed_generator",
        element: <FeedGenerator />,
      },
    ],
  },
  {
    path: "/signin",
    element: <Signin />,
  },
]);

async function useCheckForUpdate() {
  const isChecking = useRef(false);
  useEffect(() => {
    if (isChecking.current) return;
    isChecking.current = true;
    (async () => {
      const update = await check();
      if (update) {
        // TODO: downloadAndInstall
        message(`${update.version} is now avaiable`);
      }
    })();
  }, []);
}

async function useListen() {
  const isListening = useRef(false);
  const unlisten = useRef(() => {});
  useEffect(() => {
    if (isListening.current) return;
    isListening.current = true;
    (async () => {
      unlisten.current = await listen<null>(EVENT_MENU_RELOAD, () => {
        window.location.reload();
      });
    })();
    return () => unlisten.current();
  }, []);
}

const App = () => {
  useCheckForUpdate();
  useListen();
  return (
    <div className="dark">
      <div className="dark:text-gray-200 dark:bg-gray-800">
        <RouterProvider router={router} />
      </div>
    </div>
  );
};

export default App;
