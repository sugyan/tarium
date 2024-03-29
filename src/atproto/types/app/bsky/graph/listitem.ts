/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";

export interface Record {
  /** The account which is included on the list. */
  subject: string;
  /** Reference (AT-URI) to the list record (app.bsky.graph.list). */
  list: string;
  createdAt: string;
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bsky.graph.listitem#main" ||
      v.$type === "app.bsky.graph.listitem")
  );
}
