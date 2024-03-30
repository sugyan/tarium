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
  codeCount: number;
  useCount: number;
  forAccounts?: string[];
  [k: string]: unknown;
}

export interface OutputSchema {
  codes: AccountCodes[];
  [k: string]: unknown;
}

export interface AccountCodes {
  account: string;
  codes: string[];
  [k: string]: unknown;
}

export function isAccountCodes(v: unknown): v is AccountCodes {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.server.createInviteCodes#accountCodes"
  );
}
