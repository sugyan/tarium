/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyFeedDefs from "./defs";

export interface QueryParams {
  /** Reference (AT-URI) to post record. */
  uri: string;
  /** How many levels of reply depth should be included in response. */
  depth?: number;
  /** How many levels of parent (and grandparent, etc) post to include. */
  parentHeight?: number;
}

export type InputSchema = undefined;

export interface OutputSchema {
  thread:
    | AppBskyFeedDefs.ThreadViewPost
    | AppBskyFeedDefs.NotFoundPost
    | AppBskyFeedDefs.BlockedPost
    | { $type: string; [k: string]: unknown };
  [k: string]: unknown;
}
