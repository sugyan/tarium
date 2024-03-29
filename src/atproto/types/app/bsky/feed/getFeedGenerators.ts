/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
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
