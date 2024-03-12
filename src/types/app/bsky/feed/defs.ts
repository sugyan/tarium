import { isType } from "../../../utils";
import {
  ProfileViewBasic,
  ViewerState as ActorViewerState,
} from "../actor/defs";

export interface PostView {
  uri: string;
  cid: string;
  author: ProfileViewBasic;
  record: {
    createdAt: string;
    text: string;
  }; // TODO
  // embed?:
  //   | AppBskyEmbedImages.View
  //   | AppBskyEmbedExternal.View
  //   | AppBskyEmbedRecord.View
  //   | AppBskyEmbedRecordWithMedia.View
  //   | { $type: string; [k: string]: unknown }
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  indexedAt: string;
  // viewer?: ViewerState
  // labels?: ComAtprotoLabelDefs.Label[]
  // threadgate?: ThreadgateView
}

export function isPostView(v: unknown): v is PostView {
  return isType(v, "app.bsky.feed.defs#postView");
}

export interface NotFoundPost {
  uri: string;
  notFound: true;
}

export function isNotFoundPost(v: unknown): v is PostView {
  return isType(v, "app.bsky.feed.defs#notFound");
}

export interface BlockedPost {
  uri: string;
  blocked: true;
  author: BlockedAuthor;
}

export function isBlockedPost(v: unknown): v is PostView {
  return isType(v, "app.bsky.feed.defs#blocked");
}

export interface BlockedAuthor {
  did: string;
  viwer?: ActorViewerState;
}

export interface FeedViewPost {
  post: PostView;
  reply?: ReplyRef; // TODO
  reason?: any; // TODO
}

export interface ReplyRef {
  root: ReplyRefRoot;
  parent: ReplyRefParent;
}

export type ReplyRefRoot = PostView | NotFoundPost | BlockedPost;

export type ReplyRefParent = PostView | NotFoundPost | BlockedPost;
