/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export type InputSchema = undefined;

export interface OutputSchema {
  passwords: AppPassword[];
  [k: string]: unknown;
}

export interface AppPassword {
  name: string;
  createdAt: string;
  [k: string]: unknown;
}

export function isAppPassword(v: unknown): v is AppPassword {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.server.listAppPasswords#appPassword"
  );
}

export function validateAppPassword(v: unknown): ValidationResult {
  return lexicons.validate(
    "com.atproto.server.listAppPasswords#appPassword",
    v,
  );
}
