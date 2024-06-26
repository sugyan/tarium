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
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  blobs: RecordBlob[];
  [k: string]: unknown;
}

export interface RecordBlob {
  cid: string;
  recordUri: string;
  [k: string]: unknown;
}

export function isRecordBlob(v: unknown): v is RecordBlob {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.repo.listMissingBlobs#recordBlob"
  );
}
