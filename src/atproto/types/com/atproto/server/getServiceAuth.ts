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
  /** The DID of the service that the token will be used to authenticate with */
  aud: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  token: string;
  [k: string]: unknown;
}
