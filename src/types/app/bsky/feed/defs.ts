import { isType } from "../../../utils";
import {
  ProfileViewBasic,
  ViewerState as ActorViewerState,
} from "../actor/defs";
import { View as ImagesView } from "../embed/images";
import { View as ExternalView } from "../embed/external";
import { View as RecordView } from "../embed/record";
import { View as RecordWithMediaView } from "../embed/recordWithMedia";
import { RecordUnion } from "../../../records";

export interface PostView {
  uri: string;
  cid: string;
  author: ProfileViewBasic;
  record: RecordUnion;
  embed?: EmbedViewUnion;
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
  reply?: ReplyRef;
  reason?: ReasonUnion;
}

export interface ReplyRef {
  root: ReplyRefRootUnion;
  parent: ReplyRefParentUnion;
}

export interface ReasonRepost {
  by: ProfileViewBasic;
  indexedAt: string;
}

export function isPostView(v: unknown): v is PostView {
  return isType(v, "app.bsky.feed.defs#postView");
}

export function isNotFoundPost(v: unknown): v is NotFoundPost {
  return isType(v, "app.bsky.feed.defs#notFound");
}

export function isBlockedPost(v: unknown): v is BlockedPost {
  return isType(v, "app.bsky.feed.defs#blocked");
}

export function isReasonRepost(v: unknown): v is ReasonRepost {
  return isType(v, "app.bsky.feed.defs#reasonRepost");
}

export type ReplyRefRootUnion = PostView | NotFoundPost | BlockedPost;

export type ReplyRefParentUnion = PostView | NotFoundPost | BlockedPost;

export type ReasonUnion = ReasonRepost | never;

export type EmbedViewUnion =
  | ImagesView
  | ExternalView
  | RecordView
  | RecordWithMediaView;
