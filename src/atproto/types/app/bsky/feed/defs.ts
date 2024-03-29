/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyActorDefs from "../actor/defs";
import * as AppBskyEmbedImages from "../embed/images";
import * as AppBskyEmbedExternal from "../embed/external";
import * as AppBskyEmbedRecord from "../embed/record";
import * as AppBskyEmbedRecordWithMedia from "../embed/recordWithMedia";
import * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs";
import * as AppBskyRichtextFacet from "../richtext/facet";
import * as AppBskyGraphDefs from "../graph/defs";

export interface PostView {
  uri: string;
  cid: string;
  author: AppBskyActorDefs.ProfileViewBasic;
  record: {};
  embed?:
    | AppBskyEmbedImages.View
    | AppBskyEmbedExternal.View
    | AppBskyEmbedRecord.View
    | AppBskyEmbedRecordWithMedia.View
    | { $type: string; [k: string]: unknown };
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  indexedAt: string;
  viewer?: ViewerState;
  labels?: ComAtprotoLabelDefs.Label[];
  threadgate?: ThreadgateView;
  [k: string]: unknown;
}

export function isPostView(v: unknown): v is PostView {
  return (
    isObj(v) && hasProp(v, "$type") && v.$type === "app.bsky.feed.defs#postView"
  );
}

/** Metadata about the requesting account's relationship with the subject content. Only has meaningful content for authed requests. */
export interface ViewerState {
  repost?: string;
  like?: string;
  replyDisabled?: boolean;
  [k: string]: unknown;
}

export function isViewerState(v: unknown): v is ViewerState {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#viewerState"
  );
}

export interface FeedViewPost {
  post: PostView;
  reply?: ReplyRef;
  reason?: ReasonRepost | { $type: string; [k: string]: unknown };
  [k: string]: unknown;
}

export function isFeedViewPost(v: unknown): v is FeedViewPost {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#feedViewPost"
  );
}

export interface ReplyRef {
  root:
    | PostView
    | NotFoundPost
    | BlockedPost
    | { $type: string; [k: string]: unknown };
  parent:
    | PostView
    | NotFoundPost
    | BlockedPost
    | { $type: string; [k: string]: unknown };
  [k: string]: unknown;
}

export function isReplyRef(v: unknown): v is ReplyRef {
  return (
    isObj(v) && hasProp(v, "$type") && v.$type === "app.bsky.feed.defs#replyRef"
  );
}

export interface ReasonRepost {
  by: AppBskyActorDefs.ProfileViewBasic;
  indexedAt: string;
  [k: string]: unknown;
}

export function isReasonRepost(v: unknown): v is ReasonRepost {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#reasonRepost"
  );
}

export interface ThreadViewPost {
  post: PostView;
  parent?:
    | ThreadViewPost
    | NotFoundPost
    | BlockedPost
    | { $type: string; [k: string]: unknown };
  replies?: (
    | ThreadViewPost
    | NotFoundPost
    | BlockedPost
    | { $type: string; [k: string]: unknown }
  )[];
  [k: string]: unknown;
}

export function isThreadViewPost(v: unknown): v is ThreadViewPost {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#threadViewPost"
  );
}

export interface NotFoundPost {
  uri: string;
  notFound: true;
  [k: string]: unknown;
}

export function isNotFoundPost(v: unknown): v is NotFoundPost {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#notFoundPost"
  );
}

export interface BlockedPost {
  uri: string;
  blocked: true;
  author: BlockedAuthor;
  [k: string]: unknown;
}

export function isBlockedPost(v: unknown): v is BlockedPost {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#blockedPost"
  );
}

export interface BlockedAuthor {
  did: string;
  viewer?: AppBskyActorDefs.ViewerState;
  [k: string]: unknown;
}

export function isBlockedAuthor(v: unknown): v is BlockedAuthor {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#blockedAuthor"
  );
}

export interface GeneratorView {
  uri: string;
  cid: string;
  did: string;
  creator: AppBskyActorDefs.ProfileView;
  displayName: string;
  description?: string;
  descriptionFacets?: AppBskyRichtextFacet.Main[];
  avatar?: string;
  likeCount?: number;
  labels?: ComAtprotoLabelDefs.Label[];
  viewer?: GeneratorViewerState;
  indexedAt: string;
  [k: string]: unknown;
}

export function isGeneratorView(v: unknown): v is GeneratorView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#generatorView"
  );
}

export interface GeneratorViewerState {
  like?: string;
  [k: string]: unknown;
}

export function isGeneratorViewerState(v: unknown): v is GeneratorViewerState {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#generatorViewerState"
  );
}

export interface SkeletonFeedPost {
  post: string;
  reason?: SkeletonReasonRepost | { $type: string; [k: string]: unknown };
  [k: string]: unknown;
}

export function isSkeletonFeedPost(v: unknown): v is SkeletonFeedPost {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#skeletonFeedPost"
  );
}

export interface SkeletonReasonRepost {
  repost: string;
  [k: string]: unknown;
}

export function isSkeletonReasonRepost(v: unknown): v is SkeletonReasonRepost {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#skeletonReasonRepost"
  );
}

export interface ThreadgateView {
  uri?: string;
  cid?: string;
  record?: {};
  lists?: AppBskyGraphDefs.ListViewBasic[];
  [k: string]: unknown;
}

export function isThreadgateView(v: unknown): v is ThreadgateView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.feed.defs#threadgateView"
  );
}
