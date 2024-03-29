/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyFeedDefs from "./defs";

export interface QueryParams {
  feed: string;
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  feed: AppBskyFeedDefs.FeedViewPost[];
  [k: string]: unknown;
}
