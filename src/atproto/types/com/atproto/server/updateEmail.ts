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
  email: string;
  /** Requires a token from com.atproto.sever.requestEmailUpdate if the account's email has been confirmed. */
  token?: string;
  [k: string]: unknown;
}
