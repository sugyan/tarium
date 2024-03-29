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
  /** AT-URI of the feed generator record. */
  feed: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  view: AppBskyFeedDefs.GeneratorView;
  /** Indicates whether the feed generator service has been online recently, or else seems to be inactive. */
  isOnline: boolean;
  /** Indicates whether the feed generator service is compatible with the record declaration. */
  isValid: boolean;
  [k: string]: unknown;
}
