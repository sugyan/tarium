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

export interface InputSchema {
  /** The handle or DID of the repo (aka, current account). */
  repo: string;
  /** Can be set to 'false' to skip Lexicon schema validation of record data, for all operations. */
  validate?: boolean;
  writes: (Create | Update | Delete)[];
  /** If provided, the entire operation will fail if the current repo commit CID does not match this value. Used to prevent conflicting repo mutations. */
  swapCommit?: string;
  [k: string]: unknown;
}

/** Operation which creates a new record. */
export interface Create {
  collection: string;
  rkey?: string;
  value: {};
  [k: string]: unknown;
}

export function isCreate(v: unknown): v is Create {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.repo.applyWrites#create"
  );
}

/** Operation which updates an existing record. */
export interface Update {
  collection: string;
  rkey: string;
  value: {};
  [k: string]: unknown;
}

export function isUpdate(v: unknown): v is Update {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.repo.applyWrites#update"
  );
}

/** Operation which deletes an existing record. */
export interface Delete {
  collection: string;
  rkey: string;
  [k: string]: unknown;
}

export function isDelete(v: unknown): v is Delete {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.repo.applyWrites#delete"
  );
}
