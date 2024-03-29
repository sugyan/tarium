/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";
import * as AppBskyActorDefs from "./defs";

export interface QueryParams {
  /** Handle or DID of account to fetch profile of. */
  actor: string;
}

export type InputSchema = undefined;
export type OutputSchema = AppBskyActorDefs.ProfileViewDetailed;
