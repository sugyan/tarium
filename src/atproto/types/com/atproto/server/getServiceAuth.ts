/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
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
