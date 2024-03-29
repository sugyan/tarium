/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
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
