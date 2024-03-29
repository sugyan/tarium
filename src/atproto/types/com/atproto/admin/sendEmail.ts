/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export interface InputSchema {
  recipientDid: string;
  content: string;
  subject?: string;
  senderDid: string;
  /** Additional comment by the sender that won't be used in the email itself but helpful to provide more context for moderators/reviewers */
  comment?: string;
  [k: string]: unknown;
}

export interface OutputSchema {
  sent: boolean;
  [k: string]: unknown;
}
