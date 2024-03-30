import { listen } from "@tauri-apps/api/event";
import { getCurrent } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { check } from "@tauri-apps/plugin-updater";
import { createContext, useEffect, useRef, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { EVENT_MENU_RELOAD, Theme } from "./constants";
import "./index.css";
import FeedGenerator from "./routes/feed-generator";
import Home from "./routes/home";
import Root from "./routes/root";
import Signin from "./routes/signin";

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
        window.location.reload();
      });
    })();
    return unlisten.current;
  }, []);
}

const App = () => {
  const [theme, setTheme] = useState<Theme | null>(null);
  checkForUpdate();
  listenEvents();
  useEffect(() => {
    (async () => {
      setTheme(await getCurrent().theme());
    })();
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme || ""}>
        <div className="text-foreground bg-background">
          <RouterProvider router={router} />
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
