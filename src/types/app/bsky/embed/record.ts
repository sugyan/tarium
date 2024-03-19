import { RecordUnion } from "../../../records";
import { isType } from "../../../utils";
import { ProfileViewBasic } from "../actor/defs";
import { BlockedAuthor, EmbedViewUnion } from "../feed/defs";

export interface View {
  record: ViewRecordUnion;
}

export function isView(v: unknown): v is View {
  return isType(v, "app.bsky.embed.record#view");
}

export interface ViewRecord {
  uri: string;
  cid: string;
  author: ProfileViewBasic;
  value: RecordUnion;
  // labels?: ComAtprotoLabelDefs.Label[]
  embeds?: EmbedViewUnion[];
  indexedAt: string;
}

export interface ViewNotFound {
  uri: string;
  notFound: true;
}

export interface ViewBlocked {
  uri: string;
  blocked: true;
  author: BlockedAuthor;
}

export function isViewRecord(v: unknown): v is ViewRecord {
  return isType(v, "app.bsky.embed.record#viewRecord");
}

export function isViewNotFound(v: unknown): v is ViewNotFound {
  return isType(v, "app.bsky.embed.record#viewNotFound");
}

export function isViewBlocked(v: unknown): v is ViewBlocked {
  return isType(v, "app.bsky.embed.record#viewBlocked");
}

type ViewRecordUnion = ViewRecord | ViewNotFound | ViewBlocked; // TODO
