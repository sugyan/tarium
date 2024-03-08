import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import Timeline from "../components/timeline";
import { FeedViewPost } from "../types";

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
  return (
    <div className="dark:text-gray-300 dark:bg-gray-800">
      <Timeline posts={timeline} />
    </div>
  );
};

export default Home;
