/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
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
