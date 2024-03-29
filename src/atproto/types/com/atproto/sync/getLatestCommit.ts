/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";

export interface QueryParams {
  /** The DID of the repo. */
  did: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cid: string;
  rev: string;
  [k: string]: unknown;
}
