/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as ComAtprotoServerDefs from "./defs";

export interface QueryParams {
  includeUsed?: boolean;
  /** Controls whether any new 'earned' but not 'created' invites should be created. */
  createAvailable?: boolean;
}

export type InputSchema = undefined;

export interface OutputSchema {
  codes: ComAtprotoServerDefs.InviteCode[];
  [k: string]: unknown;
}
