/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";

export interface TemplateView {
  id: string;
  /** Name of the template. */
  name: string;
  /** Content of the template, can contain markdown and variable placeholders. */
  subject?: string;
  /** Subject of the message, used in emails. */
  contentMarkdown: string;
  disabled: boolean;
  /** DID of the user who last updated the template. */
  lastUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
  [k: string]: unknown;
}

export function isTemplateView(v: unknown): v is TemplateView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "tools.ozone.communication.defs#templateView"
  );
}
