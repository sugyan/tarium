export interface AspectRatio {
  width: number;
  height: number;
}

export interface View {
  images: ViewImage[];
}

export interface ViewImage {
  thumb: string;
  fullsize: string;
  alt: string;
  aspectRatio?: AspectRatio;
}
