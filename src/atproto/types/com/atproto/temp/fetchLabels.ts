/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as ComAtprotoLabelDefs from "../label/defs";

export interface QueryParams {
  since?: number;
  limit?: number;
}

export type InputSchema = undefined;

export interface OutputSchema {
  labels: ComAtprotoLabelDefs.Label[];
  [k: string]: unknown;
}
