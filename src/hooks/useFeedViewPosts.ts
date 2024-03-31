import { invoke } from "@tauri-apps/api/core";
import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import { FeedViewPost } from "../atproto/types/app/bsky/feed/defs";
import { EventName } from "../constants";
import {
  FeedPostEvent,
  isFeedPostAdd,
  isFeedPostDelete,
  isFeedPostUpdate,
} from "../events";

export function useFeedViewPosts(uri?: string) {
  const [posts, setPosts] = useState<FeedViewPost[]>([]);
  const isListening = useRef(false);
  const unlisten = useRef<UnlistenFn>(() => {});
  useEffect(() => {
    (async () => {
      if (isListening.current) return;
      isListening.current = true;
      unlisten.current = await listen<FeedPostEvent>(
        EventName.Post,
        (event) => {
          const payload = event.payload;
          if (isFeedPostAdd(payload)) {
            setPosts((prev) =>
              prev.some((post) => post.post.cid === payload.post.cid)
                ? prev
                : [payload, ...prev]
            );
          }
          if (isFeedPostUpdate(payload)) {
            setPosts((prev) =>
              prev.map((post) => {
                return post.post.cid === payload.post.cid ? payload : post;
              })
            );
          }
          if (isFeedPostDelete(payload)) {
            setPosts((prev) =>
              prev.filter((post) => post.post.cid !== payload.cid)
            );
          }
        }
      );
    })();
    return () => {
      unlisten.current();
      (async () => {
        await invoke("unsubscribe", {});
        isListening.current = false;
      })();
    };
  }, [uri]);
  useEffect(() => {
    setPosts([]);
    (async () => {
      try {
        await invoke("subscribe", { subscription: "feed", uri });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [uri]);
  return posts;
}
