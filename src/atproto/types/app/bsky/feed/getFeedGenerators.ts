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
  feeds: string[];
}

export type InputSchema = undefined;

export interface OutputSchema {
  feeds: AppBskyFeedDefs.GeneratorView[];
  [k: string]: unknown;
}
