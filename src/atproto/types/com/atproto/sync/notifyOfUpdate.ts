/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export interface InputSchema {
  /** Hostname of the current service (usually a PDS) that is notifying of update. */
  hostname: string;
  [k: string]: unknown;
}
