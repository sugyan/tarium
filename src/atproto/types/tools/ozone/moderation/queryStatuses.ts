/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as ToolsOzoneModerationDefs from "./defs";

export interface QueryParams {
  subject?: string;
  /** Search subjects by keyword from comments */
  comment?: string;
  /** Search subjects reported after a given timestamp */
  reportedAfter?: string;
  /** Search subjects reported before a given timestamp */
  reportedBefore?: string;
  /** Search subjects reviewed after a given timestamp */
  reviewedAfter?: string;
  /** Search subjects reviewed before a given timestamp */
  reviewedBefore?: string;
  /** By default, we don't include muted subjects in the results. Set this to true to include them. */
  includeMuted?: boolean;
  /** Specify when fetching subjects in a certain state */
  reviewState?: string;
  ignoreSubjects?: string[];
  /** Get all subject statuses that were reviewed by a specific moderator */
  lastReviewedBy?: string;
  sortField?: "lastReviewedAt" | "lastReportedAt";
  sortDirection?: "asc" | "desc";
  /** Get subjects that were taken down */
  takendown?: boolean;
  /** Get subjects in unresolved appealed status */
  appealed?: boolean;
  limit?: number;
  tags?: string[];
  excludeTags?: string[];
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  subjectStatuses: ToolsOzoneModerationDefs.SubjectStatusView[];
  [k: string]: unknown;
}
