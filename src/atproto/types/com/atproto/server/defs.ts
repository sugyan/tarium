/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";

export interface InviteCode {
  code: string;
  available: number;
  disabled: boolean;
  forAccount: string;
  createdBy: string;
  createdAt: string;
  uses: InviteCodeUse[];
  [k: string]: unknown;
}

export function isInviteCode(v: unknown): v is InviteCode {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.server.defs#inviteCode"
  );
}

export interface InviteCodeUse {
  usedBy: string;
  usedAt: string;
  [k: string]: unknown;
}

export function isInviteCodeUse(v: unknown): v is InviteCodeUse {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.server.defs#inviteCodeUse"
  );
}
