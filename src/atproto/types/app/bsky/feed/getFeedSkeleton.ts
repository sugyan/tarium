/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";
import * as AppBskyFeedDefs from "./defs";

export interface QueryParams {
  /** Reference to feed generator record describing the specific feed being requested. */
  feed: string;
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  feed: AppBskyFeedDefs.SkeletonFeedPost[];
  [k: string]: unknown;
}
