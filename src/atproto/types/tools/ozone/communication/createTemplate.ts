/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as ToolsOzoneCommunicationDefs from "./defs";

export interface QueryParams {}

export interface InputSchema {
  /** Name of the template. */
  name: string;
  /** Content of the template, markdown supported, can contain variable placeholders. */
  contentMarkdown: string;
  /** Subject of the message, used in emails. */
  subject: string;
  /** DID of the user who is creating the template. */
  createdBy?: string;
  [k: string]: unknown;
}

export type OutputSchema = ToolsOzoneCommunicationDefs.TemplateView;
