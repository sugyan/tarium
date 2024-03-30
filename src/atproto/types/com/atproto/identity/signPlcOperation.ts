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
  /** A token received through com.atproto.identity.requestPlcOperationSignature */
  token?: string;
  rotationKeys?: string[];
  alsoKnownAs?: string[];
  verificationMethods?: {};
  services?: {};
  [k: string]: unknown;
}

export interface OutputSchema {
  /** A signed DID PLC operation. */
  operation: {};
  [k: string]: unknown;
}
