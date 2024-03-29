/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as ComAtprotoAdminDefs from "./defs";
import * as ComAtprotoRepoStrongRef from "../repo/strongRef";

export interface QueryParams {
  did?: string;
  uri?: string;
  blob?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  subject:
    | ComAtprotoAdminDefs.RepoRef
    | ComAtprotoRepoStrongRef.Main
    | ComAtprotoAdminDefs.RepoBlobRef
    | { $type: string; [k: string]: unknown };
  takedown?: ComAtprotoAdminDefs.StatusAttr;
  [k: string]: unknown;
}
