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
  /** Reference (AT-URI) of post record */
  uri: string;
  /** If supplied, filters to reposts of specific version (by CID) of the post record. */
  cid?: string;
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  uri: string;
  cid?: string;
  cursor?: string;
  repostedBy: AppBskyActorDefs.ProfileView[];
  [k: string]: unknown;
}
