import { FeedViewPost, PostView } from "@/atproto/types/app/bsky/feed/defs";
import { hasProp, isObj } from "@/atproto/util";

export interface FeedPostAdd extends FeedViewPost {}

export function isFeedPostAdd(v: unknown): v is FeedPostAdd {
  return isObj(v) && hasProp(v, "$type") && v.$type === "add";
}

export interface FeedPostUpdate extends FeedViewPost {}

export function isFeedPostUpdate(v: unknown): v is FeedPostUpdate {
  return isObj(v) && hasProp(v, "$type") && v.$type === "update";
}

export interface FeedPostDelete extends PostView {}

export function isFeedPostDelete(v: unknown): v is FeedPostDelete {
  return isObj(v) && hasProp(v, "$type") && v.$type === "delete";
}

export type FeedPostEvent = FeedPostAdd | FeedPostUpdate | FeedPostDelete;

export interface UnreadNotification {
  count: number;
}

export function isUnreadNotification(v: unknown): v is UnreadNotification {
  return isObj(v) && hasProp(v, "$type") && v.$type === "unread";
}
