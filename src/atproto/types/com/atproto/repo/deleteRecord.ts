/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";

export interface QueryParams {}

export interface InputSchema {
  /** The handle or DID of the repo (aka, current account). */
  repo: string;
  /** The NSID of the record collection. */
  collection: string;
  /** The Record Key. */
  rkey: string;
  /** Compare and swap with the previous record by CID. */
  swapRecord?: string;
  /** Compare and swap with the previous commit by CID. */
  swapCommit?: string;
  [k: string]: unknown;
}
