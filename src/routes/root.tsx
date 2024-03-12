import { HomeIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const onSignout = async () => {
    const ok = await confirm("Are you sure you want to sign out?", {
      kind: "warning",
    });
    if (ok) {
      console.log("sign out");
      try {
        await invoke("logout", {});
      } catch (e) {
        console.error(e);
      }
      navigate("/signin");
    }
  };
  return (
    <div className="flex flex-col h-full">
      <Link to="/home">
        <HomeIcon className="h-8 w-8 m-4" />
      </Link>
      <div className="flex-grow" />
      <UserMinusIcon
        className="h-8 w-8 m-4 text-red-500 cursor-pointer"
        onClick={onSignout}
      />
    </div>
  );
};

const Root = () => {
  const location = useLocation();
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
  }, [location.pathname]);
  return (
    <div className="flex">
      <div className="flex-shrink-0 h-screen sticky top-0 border-r border-gray-500">
        <Sidebar />
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
