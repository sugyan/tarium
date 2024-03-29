/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as AppBskyActorDefs from "../actor/defs";
import * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs";

export interface QueryParams {
  limit?: number;
  cursor?: string;
  seenAt?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  notifications: Notification[];
  seenAt?: string;
  [k: string]: unknown;
}

export interface Notification {
  uri: string;
  cid: string;
  author: AppBskyActorDefs.ProfileView;
  /** Expected values are 'like', 'repost', 'follow', 'mention', 'reply', and 'quote'. */
  reason:
    | "like"
    | "repost"
    | "follow"
    | "mention"
    | "reply"
    | "quote"
    | (string & {});
  reasonSubject?: string;
  record: {};
  isRead: boolean;
  indexedAt: string;
  labels?: ComAtprotoLabelDefs.Label[];
  [k: string]: unknown;
}

export function isNotification(v: unknown): v is Notification {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.notification.listNotifications#notification"
  );
}

export function validateNotification(v: unknown): ValidationResult {
  return lexicons.validate(
    "app.bsky.notification.listNotifications#notification",
    v,
  );
}
