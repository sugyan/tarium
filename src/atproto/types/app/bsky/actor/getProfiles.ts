/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as AppBskyActorDefs from "./defs";

export interface QueryParams {
  actors: string[];
}

export type InputSchema = undefined;

export interface OutputSchema {
  profiles: AppBskyActorDefs.ProfileViewDetailed[];
  [k: string]: unknown;
}
