import { FC } from "react";
import { FeedViewPost } from "../types";

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
                <div className="flex items-center text-xs">
                  {post.post.record.createdAt}
                </div>
              </div>
              <div>{post.post.record.text}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Timeline;
