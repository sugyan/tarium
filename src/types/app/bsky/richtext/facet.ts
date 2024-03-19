import { isType } from "../../../utils";

export interface Main {
  index: ByteSlice;
  features: FeaturesUnion[];
}

export interface Mention {
  did: string;
}

export interface Link {
  uri: string;
}

export interface Tag {
  tag: string;
}

export interface ByteSlice {
  byteStart: number;
  byteEnd: number;
}

export function isMention(v: unknown): v is Mention {
  return isType(v, "app.bsky.richtext.facet#mention");
}

export function isLink(v: unknown): v is Link {
  return isType(v, "app.bsky.richtext.facet#link");
}

export function isTag(v: unknown): v is Tag {
  return isType(v, "app.bsky.richtext.facet#tag");
}

export type FeaturesUnion = Mention | Link | Tag;
