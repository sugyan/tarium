/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";

export interface QueryParams {}

export type InputSchema = undefined;

export interface OutputSchema {
  suggestions: Suggestion[];
  [k: string]: unknown;
}

export interface Suggestion {
  tag: string;
  subjectType: "actor" | "feed" | (string & {});
  subject: string;
  [k: string]: unknown;
}

export function isSuggestion(v: unknown): v is Suggestion {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.unspecced.getTaggedSuggestions#suggestion"
  );
}
