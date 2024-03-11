import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Root = () => {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        await invoke("get_session", {});
        navigate("/home");
      } catch (e) {
        navigate("/signin");
      }
    })();
  }, []);
  return (
    <div className="dark">
      <div className="flex min-h-screen dark:text-gray-300 dark:bg-gray-800">
        <div className="flex-shrink-0 min-w-20 border-r border-gray-500"></div>
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Root;
