import { FeedViewPost, PostView } from "./app/bsky/feed/defs";
import { isType } from "./utils";

export interface FeedPostAdd extends FeedViewPost {}

export function isFeedPostAdd(v: unknown): v is FeedPostAdd {
  return isType(v, "add");
}

export interface FeedPostUpdate extends FeedViewPost {}

export function isFeedPostUpdate(v: unknown): v is FeedPostUpdate {
  return isType(v, "update");
}

export interface FeedPostDelete extends PostView {}

export function isFeedPostDelete(v: unknown): v is FeedPostDelete {
  return isType(v, "delete");
}

export type FeedPostEvent = FeedPostAdd | FeedPostUpdate | FeedPostDelete;
