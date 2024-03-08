import { FC } from "react";
import { FeedViewPost } from "../types";

const Timeline: FC<{ posts: FeedViewPost[] }> = ({ posts }) => {
  return (
    <>
      {posts.map((post, index) => (
        <div key={index} style={{ borderBottom: "white 1px solid" }}>
          <p>
            {post.post.author.displayName} ({post.post.author.handle}){" "}
            {post.post.record.createdAt}
          </p>
          <p>{post.post.record.text}</p>
        </div>
      ))}
    </>
  );
};

export default Timeline;
