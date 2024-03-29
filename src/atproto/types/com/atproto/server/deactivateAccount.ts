/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export interface InputSchema {
  /** A recommendation to server as to how long they should hold onto the deactivated account before deleting. */
  deleteAfter?: string;
  [k: string]: unknown;
}
