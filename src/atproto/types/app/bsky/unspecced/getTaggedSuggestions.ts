/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
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
