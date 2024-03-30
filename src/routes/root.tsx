import {
  BellIcon,
  HomeIcon,
  PencilSquareIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { RssIcon } from "@heroicons/react/24/solid";
import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import { FC, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { GeneratorView } from "../atproto/types/app/bsky/feed/defs";
import NewPostForm from "../components/NewPostForm";

function useFeedGenerators() {
  const [feedGenerators, setFeedGenerators] = useState<GeneratorView[]>([]);
  const isLoading = useRef(false);
  useEffect(() => {
    if (isLoading.current) return;
    isLoading.current = true;
    (async () => {
      try {
        const result = await invoke<{ feeds: GeneratorView[] }>(
          "get_feed_generators",
          {}
        );
        setFeedGenerators(result.feeds);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  return feedGenerators;
}

const Sidebar: FC<{ onNewPost: () => void }> = ({ onNewPost }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const feedGenerators = useFeedGenerators();
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
    <div className="w-16 flex flex-col h-full items-center select-none">
      <Link to="/home">
        <HomeIcon className="h-10 w-10 m-3" />
      </Link>
      <div>
        <BellIcon className="h-10 w-10 m-3 text-gray-500" />
      </div>
      <div className="flex-grow overflow-scroll">
        {feedGenerators.map((view) => {
          const current = view === state ? "" : "opacity-80";
          return (
            <div key={view.cid} className={`p-2 ${current}`}>
              <Link to="/feed_generator" state={view}>
                <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-500">
                  {view.avatar ? (
                    <img src={view.avatar} />
                  ) : (
                    <div className="h-12 bg-blue-500 flex justify-center items-center">
                      <RssIcon className="h-10 w-10" />
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      <PencilSquareIcon
        className="h-10 w-10 m-3 text-blue-500 cursor-pointer"
        onClick={onNewPost}
      />
      <UserMinusIcon
        className="h-10 w-10 m-3 text-red-500 cursor-pointer"
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
