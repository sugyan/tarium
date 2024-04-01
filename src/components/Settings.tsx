import { ThemeContext } from "@/App";
import { Theme } from "@/constants";
import { useContext } from "react";

const Settings = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div className="m-4 min-w-64">
      <div className="text-xl font-bold pb-2 border-b border-slate-500">
        Settings
      </div>
      <div className="text-lg font-semibold py-2">Appearance</div>
      <div className="">
        <button
          className={`border-l border-y border-slate-500 rounded-l-lg px-4 py-2 ${
            theme === Theme.Light && "bg-more-muted"
          }`}
          onClick={() => setTheme(Theme.Light)}
        >
          Light
        </button>
        <button
          className={`border border-slate-500 rounded-r-lg px-4 py-2 ${
            theme === Theme.Dark && "bg-more-muted"
          }`}
          onClick={() => setTheme(Theme.Dark)}
        >
          Dark
        </button>
      </div>
    </div>
  );
};

export default Settings;
