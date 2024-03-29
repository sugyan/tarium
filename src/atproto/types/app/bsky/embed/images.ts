/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from "@atproto/lexicon";
import { isObj, hasProp } from "../../../../util";
import { CID } from "multiformats/cid";

export interface Main {
  images: Image[];
  [k: string]: unknown;
}

export function isMain(v: unknown): v is Main {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bsky.embed.images#main" ||
      v.$type === "app.bsky.embed.images")
  );
}

export interface Image {
  image: BlobRef;
  /** Alt text description of the image, for accessibility. */
  alt: string;
  aspectRatio?: AspectRatio;
  [k: string]: unknown;
}

export function isImage(v: unknown): v is Image {
  return (
    isObj(v) && hasProp(v, "$type") && v.$type === "app.bsky.embed.images#image"
  );
}

/** width:height represents an aspect ratio. It may be approximate, and may not correspond to absolute dimensions in any given unit. */
export interface AspectRatio {
  width: number;
  height: number;
  [k: string]: unknown;
}

export function isAspectRatio(v: unknown): v is AspectRatio {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.images#aspectRatio"
  );
}

export interface View {
  images: ViewImage[];
  [k: string]: unknown;
}

export function isView(v: unknown): v is View {
  return (
    isObj(v) && hasProp(v, "$type") && v.$type === "app.bsky.embed.images#view"
  );
}

export interface ViewImage {
  /** Fully-qualified URL where a thumbnail of the image can be fetched. For example, CDN location provided by the App View. */
  thumb: string;
  /** Fully-qualified URL where a large version of the image can be fetched. May or may not be the exact original blob. For example, CDN location provided by the App View. */
  fullsize: string;
  /** Alt text description of the image, for accessibility. */
  alt: string;
  aspectRatio?: AspectRatio;
  [k: string]: unknown;
}

export function isViewImage(v: unknown): v is ViewImage {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.images#viewImage"
  );
}
