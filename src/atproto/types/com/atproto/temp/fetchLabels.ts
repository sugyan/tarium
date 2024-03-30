/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
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
