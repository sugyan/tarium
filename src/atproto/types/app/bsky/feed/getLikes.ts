/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyActorDefs from "../actor/defs";

export interface QueryParams {
  /** AT-URI of the subject (eg, a post record). */
  uri: string;
  /** CID of the subject record (aka, specific version of record), to filter likes. */
  cid?: string;
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  uri: string;
  cid?: string;
  cursor?: string;
  likes: Like[];
  [k: string]: unknown;
}

export interface Like {
  indexedAt: string;
  createdAt: string;
  actor: AppBskyActorDefs.ProfileView;
  [k: string]: unknown;
}

export function isLike(v: unknown): v is Like {
  return (
    isObj(v) && hasProp(v, "$type") && v.$type === "app.bsky.feed.getLikes#like"
  );
}
