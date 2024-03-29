/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";

export interface QueryParams {
  /** The handle to resolve. */
  handle: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  did: string;
  [k: string]: unknown;
}
