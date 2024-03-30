import {
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  PencilSquareIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { RssIcon } from "@heroicons/react/24/solid";
import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GeneratorView } from "../atproto/types/app/bsky/feed/defs";

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

const Sidebar: FC<{ onNewPost: () => void; onSettings: () => void }> = ({
  onNewPost,
  onSettings,
}) => {
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
        <BellIcon className="h-10 w-10 m-3 text-slate-500" />
      </div>
      <div className="flex-grow overflow-scroll">
        {feedGenerators.map((view) => {
          const current = view === state ? "" : "opacity-80";
          return (
            <div key={view.cid} className={`p-2 ${current}`}>
              <Link to="/feed_generator" state={view}>
                <div className="h-12 w-12 rounded-lg overflow-hidden border border-slate-500">
                  {view.avatar ? (
                    <img src={view.avatar} />
                  ) : (
                    <div className="h-12 bg-blue-500 flex justify-center items-center">
                      <RssIcon className="text-white h-10 w-10" />
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      <div>
        <PencilSquareIcon
          className="h-10 w-10 m-3 text-blue-500 cursor-pointer"
          onClick={onNewPost}
        />
      </div>
      <div>
        <Cog6ToothIcon
          className="h-10 w-10 m-3 text-muted cursor-pointer"
          onClick={onSettings}
        />
      </div>
      <div>
        <UserMinusIcon
          className="h-10 w-10 m-3 text-red-500 cursor-pointer"
          onClick={onSignout}
        />
      </div>
    </div>
  );
};

export default Sidebar;
