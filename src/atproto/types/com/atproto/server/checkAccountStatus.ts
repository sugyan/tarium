/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export type InputSchema = undefined;

export interface OutputSchema {
  activated: boolean;
  validDid: boolean;
  repoCommit: string;
  repoRev: string;
  repoBlocks: number;
  indexedRecords: number;
  privateStateValues: number;
  expectedBlobs: number;
  importedBlobs: number;
  [k: string]: unknown;
}
