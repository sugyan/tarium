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
  /** DEPRECATED: use 'q' instead. */
  term?: string;
  /** Search query prefix; not a full query string. */
  q?: string;
  limit?: number;
}

export type InputSchema = undefined;

export interface OutputSchema {
  actors: AppBskyActorDefs.ProfileViewBasic[];
  [k: string]: unknown;
}
