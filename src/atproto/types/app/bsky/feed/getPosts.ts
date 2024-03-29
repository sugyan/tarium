/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";
import * as AppBskyFeedDefs from "./defs";

export interface QueryParams {
  /** List of post AT-URIs to return hydrated views for. */
  uris: string[];
}

export type InputSchema = undefined;

export interface OutputSchema {
  posts: AppBskyFeedDefs.PostView[];
  [k: string]: unknown;
}
