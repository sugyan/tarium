import {
  ArrowPathRoundedSquareIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow, parseISO } from "date-fns";
import { FC } from "react";
import {
  ViewImage,
  isView as isImagesView,
} from "../types/app/bsky/embed/images";
import { isView as isRecordWithMediaView } from "../types/app/bsky/embed/recordWithMedia";
import {
  EmbedViewUnion,
  FeedViewPost,
  PostView,
  ReplyRef,
  isPostView,
} from "../types/app/bsky/feed/defs";

const TimelineCellEmbed: FC<{ embed?: EmbedViewUnion }> = ({ embed }) => {
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

const TimelineCell: FC<{ post: PostView; isParent: boolean }> = ({
  post,
  isParent,
}) => {
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
          <div className="flex items-center text-sm">
            {formatDistanceToNow(parseISO(post.indexedAt), {
              includeSeconds: true,
            })}
          </div>
        </div>
        <div className="flex-wrap">{post.record.text}</div>
        <TimelineCellEmbed embed={post.embed} />
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

const ReplyCell: FC<{ reply: ReplyRef }> = ({ reply }) => {
  return (
    <>
      {isPostView(reply.parent) && (
        <TimelineCell post={reply.parent} isParent={true} />
      )}
    </>
  );
};

const Timeline: FC<{ posts: FeedViewPost[] }> = ({ posts }) => {
  return (
    <>
      {posts.map((post, index) => (
        <div key={index} className="border-b border-gray-500 px-3 pt-3">
          {post.reply && <ReplyCell reply={post.reply} />}
          <TimelineCell post={post.post} isParent={false} />
        </div>
      ))}
    </>
  );
};

export default Timeline;
