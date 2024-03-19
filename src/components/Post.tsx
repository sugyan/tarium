import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { FC } from "react";
import { PostView } from "../types/app/bsky/feed/defs";
import { isRecord } from "../types/app/bsky/feed/post";
import DistanceToNow from "./DistanceToNow";
import PostEmbed from "./PostEmbed";
import PostText from "./PostText";

const Post: FC<{ post: PostView; isParent?: boolean }> = ({
  post,
  isParent = false,
}) => {
  return (
    <div className="flex overflow-hidden break-words">
      <div className="flex flex-col items-center mr-2">
        <div className="min-h-12 w-12 rounded-full overflow-hidden">
          {post.author.avatar ? (
            <img src={post.author.avatar} />
          ) : (
            <div className="bg-blue-500">
              <UserCircleIcon />
            </div>
          )}
        </div>
        {isParent && <div className="w-0.5 h-full bg-gray-600" />}
      </div>
      <div className="w-full pb-3">
        <div className="flex justify-between">
          <div className="flex items-center">
            <span className="font-semibold">
              {post.author.displayName || post.author.handle}
            </span>
            <span className="text-sm font-mono pl-2 text-gray-400">
              @{post.author.handle}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <DistanceToNow date={post.indexedAt} />
          </div>
        </div>
        {isRecord(post.record) && <PostText record={post.record} />}
        <PostEmbed embed={post.embed} />
        <div className="flex text-sm text-gray-500 mt-2">
          <div className="flex items-center w-20">
            <ChatBubbleBottomCenterIcon className="h-4 w-4 mr-1" />
            {post.replyCount || ""}
          </div>
          <div className="flex items-center w-20">
            <ArrowPathRoundedSquareIcon className="h-4 w-4 mr-1" />
            {post.repostCount || ""}
          </div>
          <div className="flex items-center w-20">
            <HeartIcon className="h-4 w-4 mr-1" />
            {post.likeCount || ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
