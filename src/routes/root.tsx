import { ThemeContext } from "@/App";
import NewPostForm from "@/components/NewPostForm";
import Settings from "@/components/Settings";
import Sidebar from "@/components/Sidebar";
import { invoke } from "@tauri-apps/api/core";
import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Root = () => {
  const { theme } = useContext(ThemeContext);
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
      <Modal
        isOpen={isNewPostOpen}
        ariaHideApp={false}
        onRequestClose={() => setNewPostOpen(false)}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-64 w-96 rounded shadow-lg shadow-slate-950 outline-none text-foreground bg-background ${theme}`}
        overlayClassName="fixed inset-0 backdrop-blur-sm backdrop-contrast-75 z-50"
      >
        <NewPostForm onCancel={() => setNewPostOpen(false)} />
      </Modal>
      <Modal
        isOpen={isSettingsOpen}
        ariaHideApp={false}
        onRequestClose={() => setSettingsOpen(false)}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-64 w-auto rounded shadow-lg shadow-slate-950 outline-none text-foreground bg-background ${theme}`}
        overlayClassName="fixed inset-0 backdrop-blur-sm backdrop-contrast-75 z-50"
      >
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
