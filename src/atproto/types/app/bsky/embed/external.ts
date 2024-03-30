/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";

/** A representation of some externally linked content (eg, a URL and 'card'), embedded in a Bluesky record (eg, a post). */
export interface Main {
  external: External;
  [k: string]: unknown;
}

export function isMain(v: unknown): v is Main {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bsky.embed.external#main" ||
      v.$type === "app.bsky.embed.external")
  );
}

export interface External {
  uri: string;
  title: string;
  description: string;
  thumb?: BlobRef;
  [k: string]: unknown;
}

export function isExternal(v: unknown): v is External {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.external#external"
  );
}

export interface View {
  external: ViewExternal;
  [k: string]: unknown;
}

export function isView(v: unknown): v is View {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.external#view"
  );
}

export interface ViewExternal {
  uri: string;
  title: string;
  description: string;
  thumb?: string;
  [k: string]: unknown;
}

export function isViewExternal(v: unknown): v is ViewExternal {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.external#viewExternal"
  );
}
