/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  repos: Repo[];
  [k: string]: unknown;
}

export interface Repo {
  did: string;
  /** Current repo commit CID */
  head: string;
  rev: string;
  [k: string]: unknown;
}

export function isRepo(v: unknown): v is Repo {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.sync.listRepos#repo"
  );
}
