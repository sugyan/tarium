/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyLabelerDefs from "./defs";
import * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs";

export interface Record {
  policies: AppBskyLabelerDefs.LabelerPolicies;
  labels?:
    | ComAtprotoLabelDefs.SelfLabels
    | { $type: string; [k: string]: unknown };
  createdAt: string;
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bsky.labeler.service#main" ||
      v.$type === "app.bsky.labeler.service")
  );
}
