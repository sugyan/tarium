/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export type InputSchema = undefined;

export interface OutputSchema {
  /** If true, an invite code must be supplied to create an account on this instance. */
  inviteCodeRequired?: boolean;
  /** If true, a phone verification token must be supplied to create an account on this instance. */
  phoneVerificationRequired?: boolean;
  /** List of domain suffixes that can be used in account handles. */
  availableUserDomains: string[];
  links?: Links;
  contact?: Contact;
  did: string;
  [k: string]: unknown;
}

export interface Links {
  privacyPolicy?: string;
  termsOfService?: string;
  [k: string]: unknown;
}

export function isLinks(v: unknown): v is Links {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.server.describeServer#links"
  );
}

export interface Contact {
  email?: string;
  [k: string]: unknown;
}

export function isContact(v: unknown): v is Contact {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.server.describeServer#contact"
  );
}
