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
  serviceDid: string;
  token: string;
  platform: "ios" | "android" | "web" | (string & {});
  appId: string;
  [k: string]: unknown;
}
