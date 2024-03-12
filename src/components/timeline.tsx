import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow, parseISO } from "date-fns";
import { FC } from "react";
import { FeedViewPost, PostView } from "../types/app/bsky/feed/defs";

const TimelineCell: FC<{ post: PostView }> = ({ post }) => {
  return (
    <div className="flex overflow-hidden break-all">
      <div className="mr-2">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          {post.author.avatar ? (
            <img src={post.author.avatar} />
          ) : (
            <div className="bg-blue-500">
              <UserIcon className="py-2" />
            </div>
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <div className="flex items-center">
            <span className="font-semibold">{post.author.displayName}</span>
            <span className="text-sm font-mono pl-2">
              @{post.author.handle}
            </span>
          </div>
          <div className="flex items-center text-sm">
            {formatDistanceToNow(parseISO(post.indexedAt), {
              includeSeconds: true,
            })}
          </div>
        </div>
        <div className="flex-wrap">{post.record.text}</div>
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

const Timeline: FC<{ posts: FeedViewPost[] }> = ({ posts }) => {
  return (
    <div>
      {posts.map((post, index) => (
        <div
          key={index}
          className="border-b-2 border-gray-300 p-3 dark:border-gray-700"
        >
          <TimelineCell post={post.post} />
        </div>
      ))}
    </div>
  );
};

export default Timeline;
