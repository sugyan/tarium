/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";

export interface QueryParams {
  /** The handle or DID of the repo. */
  repo: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  handle: string;
  did: string;
  /** The complete DID document for this account. */
  didDoc: {};
  /** List of all the collections (NSIDs) for which this repo contains at least one record. */
  collections: string[];
  /** Indicates if handle is currently valid (resolves bi-directionally) */
  handleIsCorrect: boolean;
  [k: string]: unknown;
}
