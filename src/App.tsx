import { Command, EVENT_MENU_RELOAD, SettingKey, Theme } from "@/constants";
import FeedGenerator from "@/routes/feed-generator";
import Home from "@/routes/home";
import Notifications from "@/routes/notifications";
import Root from "@/routes/root";
import Signin from "@/routes/signin";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrent } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { check } from "@tauri-apps/plugin-updater";
import { createContext, useEffect, useRef, useState } from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLoaderData,
} from "react-router-dom";

export const ThemeContext = createContext<{
  theme: Theme | null;
  setTheme: (_: Theme) => void;
}>({
  theme: null,
  setTheme: (_) => {},
});

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

async function mainLoader(): Promise<Theme | null> {
  const theme = await invoke<Theme | null>(Command.GetSetting, {
    key: SettingKey.Theme,
  });
  if (theme !== null) {
    return theme;
  }
  return await getCurrent().theme();
}

const Main = () => {
  const [theme, setTheme] = useState<Theme | null>(useLoaderData() as Theme);
  checkForUpdate();
  listenEvents();
  useEffect(() => {
    (async () => {
      await invoke(Command.SetSetting, { key: SettingKey.Theme, value: theme });
    })();
  }, [theme]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      <div className={`${theme || ""} text-foreground bg-background h-screen`}>
        <Outlet />
      </div>
    </ThemeContext.Provider>
  );
};

const App = () => {
  const routes = [
    {
      path: "/",
      element: <Root />,
      shouldRevalidate: () => false,
      children: [
        {
          index: true,
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
  ];
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      loader: mainLoader,
      children: routes,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
