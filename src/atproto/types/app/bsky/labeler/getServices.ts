/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as AppBskyLabelerDefs from "./defs";

export interface QueryParams {
  dids: string[];
  detailed?: boolean;
}

export type InputSchema = undefined;

export interface OutputSchema {
  views: (
    | AppBskyLabelerDefs.LabelerView
    | AppBskyLabelerDefs.LabelerViewDetailed
    | { $type: string; [k: string]: unknown }
  )[];
  [k: string]: unknown;
}
