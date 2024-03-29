/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as ToolsOzoneCommunicationDefs from "./defs";

export interface QueryParams {}

export type InputSchema = undefined;

export interface OutputSchema {
  communicationTemplates: ToolsOzoneCommunicationDefs.TemplateView[];
  [k: string]: unknown;
}
