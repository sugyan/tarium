/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";

export interface Main {
  uri: string;
  cid: string;
  [k: string]: unknown;
}

export function isMain(v: unknown): v is Main {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "com.atproto.repo.strongRef#main" ||
      v.$type === "com.atproto.repo.strongRef")
  );
}
