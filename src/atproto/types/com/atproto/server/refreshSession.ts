/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export type InputSchema = undefined;

export interface OutputSchema {
  accessJwt: string;
  refreshJwt: string;
  handle: string;
  did: string;
  didDoc?: {};
  [k: string]: unknown;
}
