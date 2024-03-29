/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {
  /** The DID of the repo. */
  did: string;
  /** Optional revision of the repo to list blobs since. */
  since?: string;
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  cids: string[];
  [k: string]: unknown;
}
