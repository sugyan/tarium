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
  /** A short name for the App Password, to help distinguish them. */
  name: string;
  [k: string]: unknown;
}

export type OutputSchema = AppPassword;

export interface AppPassword {
  name: string;
  password: string;
  createdAt: string;
  [k: string]: unknown;
}

export function isAppPassword(v: unknown): v is AppPassword {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.server.createAppPassword#appPassword"
  );
}
