import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import Timeline from "../components/timeline";
import { FeedViewPost } from "../types/app/bsky/feed/defs";

const Home = () => {
  const [timeline, setTimeline] = useState<FeedViewPost[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const timeline: { feed: FeedViewPost[] } = await invoke(
          "get_timeline",
          {}
        );
        setTimeline(timeline.feed);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  return <Timeline posts={timeline} />;
};

export default Home;
