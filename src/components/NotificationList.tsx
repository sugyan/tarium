import { ProfileView } from "@/atproto/types/app/bsky/actor/defs";
import { isView } from "@/atproto/types/app/bsky/embed/images";
import {
  GeneratorView,
  PostView,
  isGeneratorView,
  isPostView,
} from "@/atproto/types/app/bsky/feed/defs";
import { isRecord } from "@/atproto/types/app/bsky/feed/post";
import Avatar from "@/components/Avatar";
import DistanceToNow from "@/components/DistanceToNow";
import PostEmbed, { Generator } from "@/components/PostEmbed";
import Post from "@/components/PostView";
import { NotificationReason } from "@/constants";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { FC, PropsWithChildren } from "react";

export interface NotificationGroup {
  key: string;
  uri?: string;
  reason: NotificationReason;
  indexedAt: string;
  authors: ProfileView[];
}

const PostContent: FC<{ post: PostView }> = ({ post }) => {
  return (
    <>
      {post.record && isRecord(post.record) && (
        <div className="text-muted whitespace-pre-wrap">{post.record.text}</div>
      )}
      {isView(post.embed) && (
        <div className="w-1/4">
          <PostEmbed embed={post.embed} />
        </div>
      )}
    </>
  );
};

const NotificationView: FC<
  PropsWithChildren<{
    group: NotificationGroup;
    content?: PostView | GeneratorView | null;
  }>
> = ({ group, content, children }) => {
  const { reason, indexedAt, authors } = group;
  const avatars = (
    <div className="flex items-center mb-1">
      {authors.slice(0, 5).map((author) => (
        <div
          key={author.did}
          className="h-9 w-9 rounded-full overflow-hidden m-1"
        >
          <Avatar avatar={author.avatar} />
        </div>
      ))}
      {authors.length > 5 && (
        <span className="font-semibold text-muted ml-1">
          +{authors.length - 5}
        </span>
      )}
    </div>
  );
  const subject = (
    <>
      <span className="font-bold">
        {authors[0].displayName || authors[0].handle}
      </span>
      {authors.length === 2 && (
        <>
          {" "}
          and <span className="font-semibold">1 other</span>
        </>
      )}
      {authors.length > 2 && (
        <>
          {" "}
          and <span className="font-semibold">{authors.length - 1} others</span>
        </>
      )}
    </>
  );
  return (
    <div className="flex pb-3">
      <div className="flex flex-col items-end w-16 p-2">
        {reason === NotificationReason.Like && (
          <HeartIcon className="h-8 w-8 text-pink-500" />
        )}
        {reason === NotificationReason.Follow && (
          <UserPlusIcon className="h-8 w-8 text-blue-500" />
        )}
        {reason === NotificationReason.Repost && (
          <ArrowPathRoundedSquareIcon className="h-8 w-8 text-green-500" />
        )}
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <div>{avatars}</div>
          <div className="text-sm text-muted whitespace-nowrap">
            <DistanceToNow date={indexedAt} />
          </div>
        </div>
        <div>
          {subject} {children}
        </div>
        {isPostView(content) && <PostContent post={content} />}
        {isGeneratorView(content) && <Generator generator={content} />}
      </div>
    </div>
  );
};

const NotificationItem: FC<{
  group: NotificationGroup;
  content?: PostView | GeneratorView | null;
}> = ({ group, content }) => {
  // TODO: other content?
  const contentName = (() => {
    if (isPostView(content)) return "your post";
    if (isGeneratorView(content)) return "your custom feed";
    return null;
  })();
  switch (group.reason) {
    case NotificationReason.Like:
      return (
        <NotificationView group={group} content={content}>
          liked {contentName}
        </NotificationView>
      );
    case NotificationReason.Repost:
      return (
        <NotificationView group={group} content={content}>
          reposted your post
        </NotificationView>
      );
    case NotificationReason.Follow:
      return <NotificationView group={group}>followed you</NotificationView>;
    default:
      return (
        content &&
        isPostView(content) && <Post post={content} showReplyAuthor={true} />
      );
  }
};

const NotificationList: FC<{
  groups: NotificationGroup[];
  contents: Map<string, PostView | GeneratorView | null>;
}> = ({ groups, contents }) => {
  const [parent, _] = useAutoAnimate();
  return (
    <div ref={parent}>
      {groups.map((group) => (
        <div key={group.key} className="border-b border-slate-500 px-3 pt-3">
          <NotificationItem
            group={group}
            content={group.uri ? contents.get(group.uri) : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
