import {
  HomeIcon,
  PencilSquareIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import { FC, useEffect, useState } from "react";
import Modal from "react-modal";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import NewPostForm from "../components/NewPostForm";

const Sidebar: FC<{ onNewPost: () => void }> = ({ onNewPost }) => {
  const navigate = useNavigate();
  const onSignout = async () => {
    const ok = await confirm("Are you sure you want to sign out?", {
      kind: "warning",
    });
    if (ok) {
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
      <PencilSquareIcon
        className="h-8 w-8 m-4 text-blue-500 cursor-pointer"
        onClick={onNewPost}
      />
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
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        await invoke("get_session", {});
        if (location.pathname === "/") {
          navigate("/home");
        }
      } catch (e) {
        navigate("/signin");
      }
    })();
  }, [location.pathname]);
  const onNewPost = () => {
    setOpen(true);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        ariaHideApp={false}
        onRequestClose={() => setOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-64 w-96 rounded shadow-lg text-gray-200 bg-gray-800 shadow-slate-950 outline-none"
        overlayClassName="fixed inset-0 backdrop-blur-sm backdrop-contrast-75"
      >
        <NewPostForm onCancel={() => setOpen(false)} />
      </Modal>
      <div className="flex">
        <div className="flex-shrink-0 h-screen sticky top-0 border-r border-gray-500">
          <Sidebar onNewPost={onNewPost} />
        </div>
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Root;
