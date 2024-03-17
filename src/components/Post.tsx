import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { FC, useEffect, useRef, useState } from "react";
import {
  ViewImage,
  isView as isImagesView,
} from "../types/app/bsky/embed/images";
import { isView as isRecordWithMediaView } from "../types/app/bsky/embed/recordWithMedia";
import { EmbedViewUnion, PostView } from "../types/app/bsky/feed/defs";

const PostEmbed: FC<{ embed?: EmbedViewUnion }> = ({ embed }) => {
  const renderImages = (images: ViewImage[]) => (
    <>
      {images.map((image, index) => (
        <div key={index} className="mt-2 max-h-64 overflow-hidden">
          <img src={image.thumb} className="object-cover w-full" />
        </div>
      ))}
    </>
  );
  if (isImagesView(embed)) {
    return renderImages(embed.images);
  }
  if (isRecordWithMediaView(embed)) {
    const media = embed.media;
    if (isImagesView(media)) {
      return renderImages(media.images);
    }
  }
  return null;
};

const REFRESHES = [
  { threshold: 10_000, interval: 1000 },
  { threshold: 60_000, interval: 10_000 },
  { threshold: 3600_000, interval: 60_000 },
];

const Post: FC<{ post: PostView; isParent: boolean }> = ({
  post,
  isParent,
}) => {
  const indexedAt = parseISO(post.indexedAt);
  const [distance, setDistance] = useState<string>(
    formatDistanceToNowStrict(indexedAt)
  );
  const timeoutId = useRef<number>();
  useEffect(() => {
    const d = new Date().getTime() - indexedAt.getTime();
    const refresh = REFRESHES.find(({ threshold }) => d < threshold);
    if (refresh) {
      timeoutId.current = setTimeout(() => {
        setDistance(formatDistanceToNowStrict(indexedAt));
      }, refresh.interval - (d % refresh.interval));
    } else {
      timeoutId.current = setTimeout(() => {
        setDistance(formatDistanceToNowStrict(indexedAt));
      }, 3600_000);
    }
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [distance]);
  return (
    <div className="flex overflow-hidden break-all">
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
            <span className="font-semibold">{post.author.displayName}</span>
            <span className="text-sm font-mono pl-2">
              @{post.author.handle}
            </span>
          </div>
          <div className="flex items-center text-sm">{distance}</div>
        </div>
        <div className="flex-wrap">{post.record.text}</div>
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
