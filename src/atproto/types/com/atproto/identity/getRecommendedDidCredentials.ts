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

export type InputSchema = undefined;

export interface OutputSchema {
  /** Recommended rotation keys for PLC dids. Should be undefined (or ignored) for did:webs. */
  rotationKeys?: string[];
  alsoKnownAs?: string[];
  verificationMethods?: {};
  services?: {};
  [k: string]: unknown;
}
