/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {
  seenAt?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  count: number;
  [k: string]: unknown;
}
