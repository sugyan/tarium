import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FC } from "react";
import { FeedViewPost, isPostView } from "../types/app/bsky/feed/defs";
import Post from "./Post";

const Feed: FC<{ posts: FeedViewPost[] }> = ({ posts }) => {
  const [parent, _] = useAutoAnimate({ duration: 150 });
  return (
    <div ref={parent}>
      {posts.map((post) => {
        return (
          <div
            key={`${post.post.cid}`}
            className="border-b border-gray-500 px-3 pt-3"
          >
            {post.reply && isPostView(post.reply.parent) && (
              <Post post={post.reply.parent} isParent={true} />
            )}
            <Post post={post.post} isParent={false} />
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
