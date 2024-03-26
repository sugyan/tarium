import { invoke } from "@tauri-apps/api/core";
import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import Feed from "../components/Feed";
import { FeedViewPost } from "../types/app/bsky/feed/defs";

const Home = () => {
  const [timeline, setTimeline] = useState<FeedViewPost[]>([]);
  const isListening = useRef(false);
  const unlisten = useRef<UnlistenFn>(() => {});
  useEffect(() => {
    (async () => {
      if (isListening.current) return;
      isListening.current = true;
      unlisten.current = await listen<FeedViewPost>("post", (event) => {
        setTimeline((prev) => [event.payload, ...prev]);
      });
    })();
    return () => {
      unlisten.current();
      (async () => {
        await invoke("unsubscribe", {});
      })();
    };
  }, []);
  useEffect(() => {
    (async () => {
      try {
        await invoke("subscribe", {});
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  return <Feed posts={timeline} />;
};

export default Home;
