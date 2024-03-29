/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export interface InputSchema {
  useCount: number;
  forAccount?: string;
  [k: string]: unknown;
}

export interface OutputSchema {
  code: string;
  [k: string]: unknown;
}
