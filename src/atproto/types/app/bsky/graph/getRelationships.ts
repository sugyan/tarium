/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as AppBskyGraphDefs from "./defs";

export interface QueryParams {
  /** Primary account requesting relationships for. */
  actor: string;
  /** List of 'other' accounts to be related back to the primary. */
  others?: string[];
}

export type InputSchema = undefined;

export interface OutputSchema {
  actor?: string;
  relationships: (
    | AppBskyGraphDefs.Relationship
    | AppBskyGraphDefs.NotFoundActor
    | { $type: string; [k: string]: unknown }
  )[];
  [k: string]: unknown;
}
