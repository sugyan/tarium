/**
 * GENERATED CODE - DO NOT MODIFY
 */
// @ts-ignore
import { BlobRef } from "@atproto/lexicon";
// @ts-ignore
import { isObj, hasProp } from "../../../../util";
// @ts-ignore
import { CID } from "multiformats/cid";
import * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs";
import * as AppBskyActorDefs from "../actor/defs";
import * as AppBskyRichtextFacet from "../richtext/facet";

export interface ListViewBasic {
  uri: string;
  cid: string;
  name: string;
  purpose: ListPurpose;
  avatar?: string;
  labels?: ComAtprotoLabelDefs.Label[];
  viewer?: ListViewerState;
  indexedAt?: string;
  [k: string]: unknown;
}

export function isListViewBasic(v: unknown): v is ListViewBasic {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.graph.defs#listViewBasic"
  );
}

export interface ListView {
  uri: string;
  cid: string;
  creator: AppBskyActorDefs.ProfileView;
  name: string;
  purpose: ListPurpose;
  description?: string;
  descriptionFacets?: AppBskyRichtextFacet.Main[];
  avatar?: string;
  labels?: ComAtprotoLabelDefs.Label[];
  viewer?: ListViewerState;
  indexedAt: string;
  [k: string]: unknown;
}

export function isListView(v: unknown): v is ListView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.graph.defs#listView"
  );
}

export interface ListItemView {
  uri: string;
  subject: AppBskyActorDefs.ProfileView;
  [k: string]: unknown;
}

export function isListItemView(v: unknown): v is ListItemView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.graph.defs#listItemView"
  );
}

export type ListPurpose =
  | "app.bsky.graph.defs#modlist"
  | "app.bsky.graph.defs#curatelist"
  | (string & {});

/** A list of actors to apply an aggregate moderation action (mute/block) on. */
export const MODLIST = "app.bsky.graph.defs#modlist";
/** A list of actors used for curation purposes such as list feeds or interaction gating. */
export const CURATELIST = "app.bsky.graph.defs#curatelist";

export interface ListViewerState {
  muted?: boolean;
  blocked?: string;
  [k: string]: unknown;
}

export function isListViewerState(v: unknown): v is ListViewerState {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.graph.defs#listViewerState"
  );
}

/** indicates that a handle or DID could not be resolved */
export interface NotFoundActor {
  actor: string;
  notFound: true;
  [k: string]: unknown;
}

export function isNotFoundActor(v: unknown): v is NotFoundActor {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.graph.defs#notFoundActor"
  );
}

/** lists the bi-directional graph relationships between one actor (not indicated in the object), and the target actors (the DID included in the object) */
export interface Relationship {
  did: string;
  /** if the actor follows this DID, this is the AT-URI of the follow record */
  following?: string;
  /** if the actor is followed by this DID, contains the AT-URI of the follow record */
  followedBy?: string;
  [k: string]: unknown;
}

export function isRelationship(v: unknown): v is Relationship {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.graph.defs#relationship"
  );
}
