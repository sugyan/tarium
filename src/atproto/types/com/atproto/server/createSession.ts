/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export interface InputSchema {
  /** Handle or other identifier supported by the server for the authenticating user. */
  identifier: string;
  password: string;
  [k: string]: unknown;
}

export interface OutputSchema {
  accessJwt: string;
  refreshJwt: string;
  handle: string;
  did: string;
  didDoc?: {};
  email?: string;
  emailConfirmed?: boolean;
  [k: string]: unknown;
}
