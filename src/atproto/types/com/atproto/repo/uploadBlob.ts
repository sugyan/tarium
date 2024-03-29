/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export type InputSchema = string | Uint8Array;

export interface OutputSchema {
  blob: BlobRef;
  [k: string]: unknown;
}
