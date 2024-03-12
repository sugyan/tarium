import { ProfileViewBasic } from "../actor/defs";
import { BlockedAuthor, EmbedViewUnion } from "../feed/defs";

export interface View {
  record: ViewRecordUnion;
}

export interface ViewRecord {
  uri: string;
  cid: string;
  author: ProfileViewBasic;
  value: {};
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

type ViewRecordUnion = ViewRecord | ViewNotFound | ViewBlocked; // TODO
