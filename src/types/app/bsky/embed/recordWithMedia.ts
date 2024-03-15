import { View as RecordView } from "./record";
import { View as ImagesMedia } from "./images";
import { View as ExternalMedia } from "./external";
import { isType } from "../../../utils";

export interface View {
  record: RecordView;
  media: MediaUnion;
}

export function isView(v: unknown): v is View {
  return isType(v, "app.bsky.embed.recordWithMedia#view");
}

type MediaUnion = ImagesMedia | ExternalMedia;
