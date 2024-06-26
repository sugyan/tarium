/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as ToolsOzoneCommunicationDefs from "./defs";

export interface QueryParams {}

export interface InputSchema {
  /** ID of the template to be updated. */
  id: string;
  /** Name of the template. */
  name?: string;
  /** Content of the template, markdown supported, can contain variable placeholders. */
  contentMarkdown?: string;
  /** Subject of the message, used in emails. */
  subject?: string;
  /** DID of the user who is updating the template. */
  updatedBy?: string;
  disabled?: boolean;
  [k: string]: unknown;
}

export type OutputSchema = ToolsOzoneCommunicationDefs.TemplateView;
