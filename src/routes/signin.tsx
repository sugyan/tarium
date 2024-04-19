import { Command } from "@/constants";
import { invoke } from "@tauri-apps/api/core";
import { Outlet } from "react-router-dom";

export const loader = async () => {
  return await invoke(Command.ListSessions);
};

const Signin = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Signin;
