/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export type InputSchema = undefined;

export interface OutputSchema {
  activated: boolean;
  placeInQueue?: number;
  estimatedTimeMs?: number;
  [k: string]: unknown;
}
