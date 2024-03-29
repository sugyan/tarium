/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
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
