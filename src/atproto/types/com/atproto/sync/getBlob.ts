/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {
  /** The DID of the account. */
  did: string;
  /** The CID of the blob to fetch */
  cid: string;
}

export type InputSchema = undefined;
