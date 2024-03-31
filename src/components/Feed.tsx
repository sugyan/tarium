import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import {
  FeedViewPost,
  isPostView,
  isReasonRepost,
} from "../atproto/types/app/bsky/feed/defs";
import Post from "./PostView";

const Feed: FC<{ posts: FeedViewPost[] }> = ({ posts }) => {
  const [parent, _] = useAutoAnimate();
  return (
    <div ref={parent}>
      {posts.map((post) => {
        return (
          <div
            key={`${post.post.cid}`}
            className="border-b border-slate-500 px-3 pt-3"
          >
            {post.reply && isPostView(post.reply.parent) && (
              <Post post={post.reply.parent} isParent={true} />
            )}
            {post.reason && isReasonRepost(post.reason) && (
              <div className="flex">
                <div className="flex w-10"></div>
                <div className="w-full text-muted font-semibold text-sm">
                  <ArrowPathRoundedSquareIcon className="flex w-4 h-4 mr-1" />
                  Reposted by{" "}
                  {post.reason.by.displayName || post.reason.by.handle}
                </div>
              </div>
            )}
            <Post post={post.post} />
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
