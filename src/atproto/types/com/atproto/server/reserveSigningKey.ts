/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export interface InputSchema {
  /** The DID to reserve a key for. */
  did?: string;
  [k: string]: unknown;
}

export interface OutputSchema {
  /** The public key for the reserved signing key, in did:key serialization. */
  signingKey: string;
  [k: string]: unknown;
}
