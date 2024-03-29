/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";
import * as AppBskyUnspeccedDefs from "./defs";

export interface QueryParams {
  /** Search query string; syntax, phrase, boolean, and faceting is unspecified, but Lucene query syntax is recommended. For typeahead search, only simple term match is supported, not full syntax. */
  q: string;
  /** If true, acts as fast/simple 'typeahead' query. */
  typeahead?: boolean;
  limit?: number;
  /** Optional pagination mechanism; may not necessarily allow scrolling through entire result set. */
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  /** Count of search hits. Optional, may be rounded/truncated, and may not be possible to paginate through all hits. */
  hitsTotal?: number;
  actors: AppBskyUnspeccedDefs.SkeletonSearchActor[];
  [k: string]: unknown;
}
