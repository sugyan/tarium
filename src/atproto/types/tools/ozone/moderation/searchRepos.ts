/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";
import * as ToolsOzoneModerationDefs from "./defs";

export interface QueryParams {
  /** DEPRECATED: use 'q' instead */
  term?: string;
  q?: string;
  limit?: number;
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  repos: ToolsOzoneModerationDefs.RepoView[];
  [k: string]: unknown;
}
