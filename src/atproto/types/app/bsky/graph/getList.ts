/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";
import * as AppBskyGraphDefs from "./defs";

export interface QueryParams {
  /** Reference (AT-URI) of the list record to hydrate. */
  list: string;
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  list: AppBskyGraphDefs.ListView;
  items: AppBskyGraphDefs.ListItemView[];
  [k: string]: unknown;
}
