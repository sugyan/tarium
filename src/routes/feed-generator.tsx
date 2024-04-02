import { GeneratorView } from "@/atproto/types/app/bsky/feed/defs";
import Column from "@/components/Column";
import Feed from "@/components/Feed";
import { useFeedViewPosts } from "@/hooks/useFeedViewPosts";
import { RssIcon } from "@heroicons/react/24/solid";
import { useLocation } from "react-router-dom";

const FeedGenerator = () => {
  const { state: view }: { state: GeneratorView } = useLocation();
  const posts = useFeedViewPosts(view.uri);
  const headerContent = (
    <>
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
    </>
  );
  return (
    <Column headerContent={headerContent}>
      <Feed posts={posts} />
    </Column>
  );
};

export default FeedGenerator;
