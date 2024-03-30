/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as ComAtprotoLabelDefs from "./defs";

export interface QueryParams {
  /** List of AT URI patterns to match (boolean 'OR'). Each may be a prefix (ending with '*'; will match inclusive of the string leading to '*'), or a full URI. */
  uriPatterns: string[];
  /** Optional list of label sources (DIDs) to filter on. */
  sources?: string[];
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  labels: ComAtprotoLabelDefs.Label[];
  [k: string]: unknown;
}
