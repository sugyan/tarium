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
import * as AppBskyRichtextFacet from "../richtext/facet";
import * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs";

export interface Record {
  purpose: AppBskyGraphDefs.ListPurpose;
  /** Display name for list; can not be empty. */
  name: string;
  description?: string;
  descriptionFacets?: AppBskyRichtextFacet.Main[];
  avatar?: BlobRef;
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
    (v.$type === "app.bsky.graph.list#main" ||
      v.$type === "app.bsky.graph.list")
  );
}
