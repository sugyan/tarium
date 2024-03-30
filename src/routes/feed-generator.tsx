import { RssIcon } from "@heroicons/react/24/solid";
import { useLocation } from "react-router-dom";
import { GeneratorView } from "../atproto/types/app/bsky/feed/defs";
import Feed from "../components/Feed";
import { useFeedViewPosts } from "../hooks/useFeedViewPosts";

const FeedGenerator = () => {
  const { state: view }: { state: GeneratorView } = useLocation();
  const posts = useFeedViewPosts(view.uri);
  return (
    <>
      <div className="flex items-center p-2 border-b border-muted sticky top-0 bg-background">
        <div className="h-6 w-6 rounded overflow-hidden">
          {view.avatar ? (
            <img src={view.avatar} />
          ) : (
            <div className="h-6 bg-blue-500 flex justify-center items-center">
              <RssIcon className="h-6 w-6" />
            </div>
          )}
        </div>
        <span className="ml-2 font-semibold">{view.displayName}</span>
        <span className="ml-2 text-sm text-muted">
          created by {view.creator.displayName}
        </span>
      </div>
      <Feed posts={posts} />
    </>
  );
};

export default FeedGenerator;
