import { PostView } from "@/atproto/types/app/bsky/feed/defs";
import { isRecord } from "@/atproto/types/app/bsky/feed/post";
import Avatar from "@/components/Avatar";
import DistanceToNow from "@/components/DistanceToNow";
import PostEmbed, { EmbedView } from "@/components/PostEmbed";
import PostText from "@/components/PostText";
import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowPathRoundedSquareIcon as ArrowPathRoundedSquareIconSolid,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/solid";
import { FC } from "react";

const Post: FC<{ post: PostView; isParent?: boolean }> = ({
  post,
  isParent = false,
}) => {
  return (
    <div className="flex overflow-hidden break-words">
      <div className="flex flex-col items-center mr-2">
        <div className="min-h-12 w-12 rounded-full overflow-hidden">
          <Avatar avatar={post.author.avatar} />
        </div>
        {isParent && <div className="w-0.5 h-full bg-more-muted" />}
      </div>
      <div className="w-full pb-3">
        <div className="flex justify-between items-center">
          <div className="break-all mr-2 line-clamp-1">
            <span className="font-semibold">
              {post.author.displayName || post.author.handle}
            </span>
            <span className="text-sm font-mono pl-2 text-muted">
              @{post.author.handle}
            </span>
          </div>
          <div className="text-sm text-muted whitespace-nowrap">
            <DistanceToNow date={post.indexedAt} />
          </div>
        </div>
        {isRecord(post.record) && <PostText record={post.record} />}
        <PostEmbed embed={post.embed as EmbedView} />
        <div className="flex text-sm text-slate-500 mt-2">
          <div className="flex items-center w-20">
            <ChatBubbleBottomCenterIcon className="h-4 w-4 mr-1" />
            {post.replyCount || ""}
          </div>
          <div className="flex items-center w-20">
            {post.viewer?.repost ? (
              <div className="text-green-500 inline-flex items-center">
                <ArrowPathRoundedSquareIconSolid className="h-4 w-4 mr-1" />
                <span className="font-semibold">{post.repostCount}</span>
              </div>
            ) : (
              <>
                <ArrowPathRoundedSquareIcon className="h-4 w-4 mr-1" />
                {post.repostCount || ""}
              </>
            )}
          </div>
          <div className="flex items-center w-20">
            {post.viewer?.like ? (
              <div className="text-pink-500 inline-flex items-center">
                <HeartIconSolid className="h-4 w-4 mr-1" />
                <span className="font-semibold">{post.likeCount}</span>
              </div>
            ) : (
              <>
                <HeartIcon className="h-4 w-4 mr-1" />
                {post.likeCount || ""}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
