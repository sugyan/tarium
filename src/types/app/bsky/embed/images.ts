import { isType } from "../../../utils";

export interface AspectRatio {
  width: number;
  height: number;
}

export interface View {
  images: ViewImage[];
}

export function isView(v: unknown): v is View {
  return isType(v, "app.bsky.embed.images#view");
}

export interface ViewImage {
  thumb: string;
  fullsize: string;
  alt: string;
  aspectRatio?: AspectRatio;
}
