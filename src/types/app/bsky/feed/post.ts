import { isType } from "../../../utils";
import { Main } from "../richtext/facet";

export interface Record {
  text: string;
  facets?: Main[];
  langs?: string[];
  tags?: string[];
  createdAt: string;
}

export function isRecord(v: unknown): v is Record {
  return isType(v, "app.bsky.feed.post");
}
