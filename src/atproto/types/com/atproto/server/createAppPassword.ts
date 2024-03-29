/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
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

export function validateAppPassword(v: unknown): ValidationResult {
  return lexicons.validate(
    "com.atproto.server.createAppPassword#appPassword",
    v,
  );
}
