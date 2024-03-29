/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";

export interface SkeletonSearchPost {
  uri: string;
  [k: string]: unknown;
}

export function isSkeletonSearchPost(v: unknown): v is SkeletonSearchPost {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.unspecced.defs#skeletonSearchPost"
  );
}

export interface SkeletonSearchActor {
  did: string;
  [k: string]: unknown;
}

export function isSkeletonSearchActor(v: unknown): v is SkeletonSearchActor {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.unspecced.defs#skeletonSearchActor"
  );
}
