/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as AppBskyActorDefs from "../actor/defs";

export interface QueryParams {
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  mutes: AppBskyActorDefs.ProfileView[];
  [k: string]: unknown;
}
