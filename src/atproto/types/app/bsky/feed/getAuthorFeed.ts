/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";
import * as AppBskyFeedDefs from "./defs";

export interface QueryParams {
  actor: string;
  limit?: number;
  cursor?: string;
  /** Combinations of post/repost types to include in response. */
  filter?:
    | "posts_with_replies"
    | "posts_no_replies"
    | "posts_with_media"
    | "posts_and_author_threads"
    | (string & {});
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  feed: AppBskyFeedDefs.FeedViewPost[];
  [k: string]: unknown;
}
