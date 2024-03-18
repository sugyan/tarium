import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { FC, useEffect, useRef, useState } from "react";
import { isView as isExternalView } from "../types/app/bsky/embed/external";
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
  if (isExternalView(embed)) {
    const url = new URL(embed.external.uri);
    return (
      <div className="border border-gray-500 rounded w-full overflow-hidden mt-2 mb-4">
        <a href={embed.external.uri} target="_blank" rel="noreferrer">
          <img
            src={embed.external.thumb}
            className="w-full max-h-64 object-cover"
          />
          <div className="px-3 py-2">
            <div className="text-gray-500 text-sm">{url.host}</div>
            <div className="font-semibold mb-2">{embed.external.title}</div>
            <div className="text-sm line-clamp-2 overflow-hidden">
              {embed.external.description}
            </div>
          </div>
        </a>
      </div>
    );
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

const Post: FC<{ post: PostView; isParent?: boolean }> = ({
  post,
  isParent = false,
}) => {
  const indexedAt = parseISO(post.indexedAt);
  const [distance, setDistance] = useState<string>();
  const timeoutId = useRef<number>();
  useEffect(() => {
    const updateDistance = () => {
      setDistance(formatDistanceToNowStrict(indexedAt));
      const d = new Date().getTime() - indexedAt.getTime();
      const refresh = REFRESHES.find(({ threshold }) => d < threshold);
      timeoutId.current = setTimeout(
        updateDistance,
        refresh ? refresh.interval - (d % refresh.interval) : 3600_000
      );
    };
    updateDistance();
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);
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
            <span className="font-semibold">{post.author.displayName}</span>
            <span className="text-sm font-mono pl-2 text-gray-400">
              @{post.author.handle}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            {distance}
          </div>
        </div>
        <div className="whitespace-pre-wrap">{post.record.text}</div>
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
