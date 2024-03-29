/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyFeedDefs from "./defs";

export interface QueryParams {
  actor: string;
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  feeds: AppBskyFeedDefs.GeneratorView[];
  [k: string]: unknown;
}
