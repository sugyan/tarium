import { invoke } from "@tauri-apps/api/core";
import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import { FeedViewPost } from "../atproto/types/app/bsky/feed/defs";
import Feed from "../components/Feed";
import {
  FeedPostEvent,
  isFeedPostAdd,
  isFeedPostDelete,
  isFeedPostUpdate,
} from "../events";

const Home = () => {
  const [timeline, setTimeline] = useState<FeedViewPost[]>([]);
  const isListening = useRef(false);
  const unlisten = useRef<UnlistenFn>(() => {});
  useEffect(() => {
    (async () => {
      if (isListening.current) return;
      isListening.current = true;
      unlisten.current = await listen<FeedPostEvent>("post", (event) => {
        const payload = event.payload;
        console.log(payload);
        if (isFeedPostAdd(payload)) {
          setTimeline((prev) => [payload, ...prev]);
        }
        if (isFeedPostUpdate(payload)) {
          setTimeline((prev) =>
            prev.map((post) => {
              return post.post.cid === payload.post.cid ? payload : post;
            })
          );
        }
        if (isFeedPostDelete(payload)) {
          setTimeline((prev) =>
            prev.filter((post) => post.post.cid !== payload.cid)
          );
        }
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
