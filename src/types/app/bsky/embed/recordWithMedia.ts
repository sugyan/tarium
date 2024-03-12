import { View as RecordView } from "./record";
import { View as ImagesMedia } from "./images";
import { View as ExternalMedia } from "./external";

export interface View {
  record: RecordView;
  media: MediaUnion;
}

type MediaUnion = ImagesMedia | ExternalMedia;
