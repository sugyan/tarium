/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as ComAtprotoAdminDefs from "./defs";

export interface QueryParams {
  dids: string[];
}

export type InputSchema = undefined;

export interface OutputSchema {
  infos: ComAtprotoAdminDefs.AccountView[];
  [k: string]: unknown;
}
