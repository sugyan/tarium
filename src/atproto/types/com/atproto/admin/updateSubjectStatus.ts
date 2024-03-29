/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";
import * as ComAtprotoAdminDefs from "./defs";
import * as ComAtprotoRepoStrongRef from "../repo/strongRef";

export interface QueryParams {}

export interface InputSchema {
  subject:
    | ComAtprotoAdminDefs.RepoRef
    | ComAtprotoRepoStrongRef.Main
    | ComAtprotoAdminDefs.RepoBlobRef
    | { $type: string; [k: string]: unknown };
  takedown?: ComAtprotoAdminDefs.StatusAttr;
  [k: string]: unknown;
}

export interface OutputSchema {
  subject:
    | ComAtprotoAdminDefs.RepoRef
    | ComAtprotoRepoStrongRef.Main
    | ComAtprotoAdminDefs.RepoBlobRef
    | { $type: string; [k: string]: unknown };
  takedown?: ComAtprotoAdminDefs.StatusAttr;
  [k: string]: unknown;
}
