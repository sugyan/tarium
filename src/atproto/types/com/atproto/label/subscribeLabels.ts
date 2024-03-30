/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as ComAtprotoLabelDefs from "./defs";

export interface Labels {
  seq: number;
  labels: ComAtprotoLabelDefs.Label[];
  [k: string]: unknown;
}

export function isLabels(v: unknown): v is Labels {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.label.subscribeLabels#labels"
  );
}

export interface Info {
  name: "OutdatedCursor" | (string & {});
  message?: string;
  [k: string]: unknown;
}

export function isInfo(v: unknown): v is Info {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.label.subscribeLabels#info"
  );
}
