/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyActorDefs from "../actor/defs";

export interface QueryParams {
  actor: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  suggestions: AppBskyActorDefs.ProfileView[];
  [k: string]: unknown;
}
