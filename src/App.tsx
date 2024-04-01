import { EVENT_MENU_RELOAD, STORE_SETTING, Theme } from "@/constants";
import FeedGenerator from "@/routes/feed-generator";
import Home from "@/routes/home";
import Notifications from "@/routes/notifications";
import Root from "@/routes/root";
import Signin from "@/routes/signin";
import { listen } from "@tauri-apps/api/event";
import { message } from "@tauri-apps/plugin-dialog";
import { Store } from "@tauri-apps/plugin-store";
import { check } from "@tauri-apps/plugin-updater";
import { createContext, useEffect, useRef, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

export const ThemeContext = createContext<{
  theme: Theme | null;
  setTheme: (_: Theme) => void;
}>({
  theme: null,
  setTheme: (_) => {},
});
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
        path: "/notifications",
        element: <Notifications />,
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

function checkForUpdate() {
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

function listenEvents() {
  const isListening = useRef(false);
  const unlisten = useRef(() => {});
  useEffect(() => {
    if (isListening.current) return;
    isListening.current = true;
    (async () => {
      unlisten.current = await listen<null>(EVENT_MENU_RELOAD, () => {
        console.log("Reload!");
      });
    })();
    return unlisten.current;
  }, []);
}

const App = () => {
  const [theme, setTheme] = useState<Theme | null>(null);
  const store = new Store(STORE_SETTING);
  checkForUpdate();
  listenEvents();
  useEffect(() => {
    (async () => {
      setTheme(await store.get("theme"));
    })();
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (value: Theme | null) => {
          (async () => {
            await store.set("theme", value);
            await store.save();
          })();
          setTheme(value);
        },
      }}
    >
      <div className={`${theme || ""} text-foreground bg-background`}>
        <RouterProvider router={router} />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
