/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export interface InputSchema {
  serviceDid: string;
  token: string;
  platform: "ios" | "android" | "web" | (string & {});
  appId: string;
  [k: string]: unknown;
}
