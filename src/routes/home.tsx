import { invoke } from "@tauri-apps/api/core";
import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import Timeline from "../components/timeline";
import { FeedViewPost } from "../types/app/bsky/feed/defs";

const Home = () => {
  const [timeline, setTimeline] = useState<FeedViewPost[]>([]);
  const isListening = useRef(false);
  const unlisten = useRef<UnlistenFn>(() => {});
  useEffect(() => {
    (async () => {
      if (!isListening.current) {
        isListening.current = true;
        unlisten.current = await listen<FeedViewPost>("post", (event) => {
          console.log("got post event: ", event.payload.post.cid);
          setTimeline((prev) => [event.payload, ...prev]);
        });
      }
    })();
    return unlisten.current;
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
  return <Timeline posts={timeline} />;
};

export default Home;
