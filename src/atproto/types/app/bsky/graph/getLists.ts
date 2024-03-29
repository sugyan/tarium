/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyGraphDefs from "./defs";

export interface QueryParams {
  /** The account (actor) to enumerate lists from. */
  actor: string;
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  lists: AppBskyGraphDefs.ListView[];
  [k: string]: unknown;
}
