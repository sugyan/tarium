import { isType } from "../../../utils";
import {
  ProfileViewBasic,
  ViewerState as ActorViewerState,
} from "../actor/defs";
import { View as ImagesView } from "../embed/images";
import { View as ExternalView } from "../embed/external";
import { View as RecordView } from "../embed/record";
import { View as RecordWithMediaView } from "../embed/recordWithMedia";

export interface PostView {
  uri: string;
  cid: string;
  author: ProfileViewBasic;
  record: {
    createdAt: string;
    text: string;
  }; // TODO
  embed?: EmbedViewUnion;
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

export interface NotFoundPost {
  uri: string;
  notFound: true;
}

export interface BlockedPost {
  uri: string;
  blocked: true;
  author: BlockedAuthor;
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
  root: ReplyRefRootUnion;
  parent: ReplyRefParentUnion;
}

export function isPostView(v: unknown): v is PostView {
  return isType(v, "app.bsky.feed.defs#postView");
}

export function isNotFoundPost(v: unknown): v is PostView {
  return isType(v, "app.bsky.feed.defs#notFound");
}

export function isBlockedPost(v: unknown): v is PostView {
  return isType(v, "app.bsky.feed.defs#blocked");
}

export type ReplyRefRootUnion = PostView | NotFoundPost | BlockedPost;

export type ReplyRefParentUnion = PostView | NotFoundPost | BlockedPost;

export function isEmbedImagesView(v: unknown): v is ImagesView {
  return isType(v, "app.bsky.embed.images#view");
}

export function isEmbedExternalView(v: unknown): v is ExternalView {
  return isType(v, "app.bsky.embed.external#view");
}

export function isEmbedRecordView(v: unknown): v is RecordView {
  return isType(v, "app.bsky.embed.record#view");
}

export function isEmbedRecordWithMediaView(
  v: unknown
): v is RecordWithMediaView {
  return isType(v, "app.bsky.embed.recordWithMedia#view");
}

export type EmbedViewUnion =
  | ImagesView
  | ExternalView
  | RecordView
  | RecordWithMediaView;
