/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as ComAtprotoServerDefs from "../server/defs";

export interface StatusAttr {
  applied: boolean;
  ref?: string;
  [k: string]: unknown;
}

export function isStatusAttr(v: unknown): v is StatusAttr {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.admin.defs#statusAttr"
  );
}

export interface AccountView {
  did: string;
  handle: string;
  email?: string;
  relatedRecords?: {}[];
  indexedAt: string;
  invitedBy?: ComAtprotoServerDefs.InviteCode;
  invites?: ComAtprotoServerDefs.InviteCode[];
  invitesDisabled?: boolean;
  emailConfirmedAt?: string;
  inviteNote?: string;
  [k: string]: unknown;
}

export function isAccountView(v: unknown): v is AccountView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.admin.defs#accountView"
  );
}

export interface RepoRef {
  did: string;
  [k: string]: unknown;
}

export function isRepoRef(v: unknown): v is RepoRef {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.admin.defs#repoRef"
  );
}

export interface RepoBlobRef {
  did: string;
  cid: string;
  recordUri?: string;
  [k: string]: unknown;
}

export function isRepoBlobRef(v: unknown): v is RepoBlobRef {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.admin.defs#repoBlobRef"
  );
}
