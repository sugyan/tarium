/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
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
