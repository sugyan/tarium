/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
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
