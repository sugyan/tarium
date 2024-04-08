import { ThemeContext } from "@/App";
import { Command, SettingKey, Theme } from "@/constants";
import { BellAlertIcon, EyeIcon } from "@heroicons/react/24/outline";
import { invoke } from "@tauri-apps/api/core";
import { useContext, useEffect, useState } from "react";

const Settings = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isChecked, setChecked] = useState(true);
  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      const value = await invoke<boolean | null>(Command.GetSetting, {
        key: SettingKey.Notification,
      });
      if (value !== null) {
        setChecked(value);
      }
      setLoaded(true);
    })();
  }, []);
  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      await invoke(Command.SetSetting, {
        key: SettingKey.Notification,
        value: isChecked,
      });
    })();
  }, [isChecked]);
  return isLoaded ? (
    <div className="m-4 min-w-64">
      <div className="text-xl font-bold pb-2 border-b border-slate-500">
        Settings
      </div>
      <div className="text-lg font-semibold pt-4 pb-3 flex items-center">
        <EyeIcon className="h-8 w-8 mr-2" />
        Appearance
      </div>
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
      <div className="h-4" />
      <div className="text-lg font-semibold pt-4 pb-3 flex items-center">
        <BellAlertIcon className="h-8 w-8 mr-2" />
        Notification
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          onChange={() => setChecked(!isChecked)}
        />
        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm text-muted">
          {isChecked ? "Enabled" : "Disabled"}
        </span>
      </label>
    </div>
  ) : null;
};

export default Settings;
