/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as ComAtprotoServerDefs from "../server/defs";

export interface QueryParams {
  sort?: "recent" | "usage" | (string & {});
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  codes: ComAtprotoServerDefs.InviteCode[];
  [k: string]: unknown;
}
