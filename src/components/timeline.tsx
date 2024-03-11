import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow, parseISO } from "date-fns";
import { FC } from "react";
import { FeedViewPost } from "../types/app/bsky/feed/defs";

const Timeline: FC<{ posts: FeedViewPost[] }> = ({ posts }) => {
  return (
    <>
      {posts.map((post, index) => (
        <div
          key={index}
          className="border-b-2 border-gray-300 p-3 dark:border-gray-700 dark:text-gray-300 dark:bg-gray-800"
        >
          <div className="flex">
            <div className="mr-4">
              <img
                src={post.post.author.avatar}
                className="max-h-16 max-w-16 rounded-full"
              />
            </div>
            <div className="w-full">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="font-semibold">
                    {post.post.author.displayName}
                  </span>
                  <span className="text-sm font-mono pl-2">
                    @{post.post.author.handle}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  {formatDistanceToNow(parseISO(post.post.indexedAt))}
                </div>
              </div>
              <div>{post.post.record.text}</div>
              <div className="flex text-sm text-gray-500 mt-2">
                <div className="flex items-center w-20">
                  <ChatBubbleBottomCenterIcon className="h-4 w-4 mr-1" />
                  {post.post.replyCount || ""}
                </div>
                <div className="flex items-center w-20">
                  <ArrowPathRoundedSquareIcon className="h-4 w-4 mr-1" />
                  {post.post.repostCount || ""}
                </div>
                <div className="flex items-center w-20">
                  <HeartIcon className="h-4 w-4 mr-1" />
                  {post.post.likeCount || ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Timeline;
