/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {
  /** The DID of the repo. */
  did: string;
  collection: string;
  /** Record Key */
  rkey: string;
  /** DEPRECATED: referenced a repo commit by CID, and retrieved record as of that commit */
  commit?: string;
}

export type InputSchema = undefined;
