import { ProfileViewDetailed } from "@/atproto/types/app/bsky/actor/defs";
import { GeneratorView } from "@/atproto/types/app/bsky/feed/defs";
import Avatar from "@/components/Avatar";
import { Command, EventName } from "@/constants";
import { UnreadNotification } from "@/events";
import {
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { RssIcon } from "@heroicons/react/24/solid";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function useFeedGenerators() {
  const [feedGenerators, setFeedGenerators] = useState<GeneratorView[]>([]);
  useEffect(() => {
    (async () => {
      const result = await invoke<{ feeds: GeneratorView[] }>(
        Command.GetPinnedFeedGenerators
      );
      setFeedGenerators(result.feeds);
    })();
  }, []);
  return feedGenerators;
}

function useUnreadCount() {
  const [count, setCount] = useState(0);
  const isListening = useRef(false);
  const unlisten = useRef(() => {});
  useEffect(() => {
    if (isListening.current) return;
    isListening.current = true;
    (async () => {
      unlisten.current = await listen<UnreadNotification>(
        EventName.UnreadCount,
        (event) => {
          setCount(event.payload.count);
        }
      );
    })();
    return () => {
      unlisten.current();
      (async () => {
        await invoke(Command.UnsubscribeNotification);
      })();
    };
  }, []);
  useEffect(() => {
    (async () => {
      await invoke(Command.SubscribeNotification);
    })();
  }, []);
  return count;
}

const Sidebar: FC<{
  profile: ProfileViewDetailed | null;
  onNewPost: () => void;
  onSettings: () => void;
  onAccount: () => void;
}> = ({ profile, onNewPost, onSettings, onAccount }) => {
  const { state, pathname } = useLocation();
  const feedGenerators = useFeedGenerators();
  const unread = useUnreadCount();
  return (
    <div className="w-16 flex flex-col h-full items-center select-none">
      <div className={`p-2 ${pathname === "/" && "bg-more-muted"}`}>
        <Link to="/">
          <div className="flex justify-center items-center h-12 w-12 rounded-lg overflow-hidden border border-slate-500 bg-background">
            <HomeIcon className="h-10 w-10" />
          </div>
        </Link>
      </div>
      <div
        className={`p-2 relative ${
          pathname === "/notifications" && "bg-more-muted"
        }`}
      >
        <Link to="/notifications">
          <div className="flex justify-center items-center h-12 w-12 rounded-lg overflow-hidden border border-slate-500 bg-background">
            <BellIcon className="h-10 w-10" />
            {unread ? (
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-blue-500 border-2 border-more-muted rounded-full top-0.5 right-0.5">
                {unread}
                {unread > 30 && <span className="font-light">+</span>}
              </div>
            ) : null}
          </div>
        </Link>
      </div>
      <div className="flex-grow overflow-scroll">
        {feedGenerators.map((view) => {
          const current = view === state ? "bg-more-muted" : "";
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
        <div
          className="h-12 w-12 m-2 rounded-full overflow-hidden cursor-pointer"
          onClick={onAccount}
        >
          {profile && <Avatar avatar={profile.avatar} />}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
