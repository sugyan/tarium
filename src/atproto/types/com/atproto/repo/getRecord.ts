/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";

export interface QueryParams {
  /** The handle or DID of the repo. */
  repo: string;
  /** The NSID of the record collection. */
  collection: string;
  /** The Record Key. */
  rkey: string;
  /** The CID of the version of the record. If not specified, then return the most recent version. */
  cid?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  uri: string;
  cid?: string;
  value: {};
  [k: string]: unknown;
}
