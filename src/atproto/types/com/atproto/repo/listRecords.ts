/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";

export interface QueryParams {
  /** The handle or DID of the repo. */
  repo: string;
  /** The NSID of the record type. */
  collection: string;
  /** The number of records to return. */
  limit?: number;
  cursor?: string;
  /** DEPRECATED: The lowest sort-ordered rkey to start from (exclusive) */
  rkeyStart?: string;
  /** DEPRECATED: The highest sort-ordered rkey to stop at (exclusive) */
  rkeyEnd?: string;
  /** Flag to reverse the order of the returned records. */
  reverse?: boolean;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  records: Record[];
  [k: string]: unknown;
}

export interface Record {
  uri: string;
  cid: string;
  value: {};
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.repo.listRecords#record"
  );
}
