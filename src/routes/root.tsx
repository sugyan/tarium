import Modal from "@/components/Modal";
import NewPostForm from "@/components/NewPostForm";
import Settings from "@/components/Settings";
import Sidebar from "@/components/Sidebar";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Root = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNewPostOpen, setNewPostOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
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
    setNewPostOpen(true);
  };
  const onSettings = () => {
    setSettingsOpen(true);
  };
  return (
    <>
      <Modal isShow={isNewPostOpen} setShow={setNewPostOpen}>
        <NewPostForm onCancel={() => setNewPostOpen(false)} />
      </Modal>
      <Modal isShow={isSettingsOpen} setShow={setSettingsOpen}>
        <Settings />
      </Modal>
      <div className="flex">
        <div className="flex-shrink-0 h-screen sticky top-0 border-r border-slate-500">
          <Sidebar onNewPost={onNewPost} onSettings={onSettings} />
        </div>
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Root;
