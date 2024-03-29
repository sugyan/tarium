/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyActorDefs from "../actor/defs";

export interface QueryParams {
  actor: string;
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  subject: AppBskyActorDefs.ProfileView;
  cursor?: string;
  follows: AppBskyActorDefs.ProfileView[];
  [k: string]: unknown;
}
