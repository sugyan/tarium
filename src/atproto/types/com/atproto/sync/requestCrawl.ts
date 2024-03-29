/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export interface InputSchema {
  /** Hostname of the current service (eg, PDS) that is requesting to be crawled. */
  hostname: string;
  [k: string]: unknown;
}
