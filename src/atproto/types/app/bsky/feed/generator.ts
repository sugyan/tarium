/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyRichtextFacet from "../richtext/facet";
import * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs";

export interface Record {
  did: string;
  displayName: string;
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
    (v.$type === "app.bsky.feed.generator#main" ||
      v.$type === "app.bsky.feed.generator")
  );
}
