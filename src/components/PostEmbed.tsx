import { UserCircleIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import {
  ViewExternal,
  isView as isExternalView,
} from "../types/app/bsky/embed/external";
import {
  ViewImage,
  isView as isImagesView,
} from "../types/app/bsky/embed/images";
import {
  ViewRecord,
  isView as isRecordView,
  isViewRecord,
} from "../types/app/bsky/embed/record";
import { isView as isRecordWithMediaView } from "../types/app/bsky/embed/recordWithMedia";
import { EmbedViewUnion } from "../types/app/bsky/feed/defs";
import { isRecord } from "../types/app/bsky/feed/post";
import DistanceToNow from "./DistanceToNow";

const Images: FC<{ images: ViewImage[] }> = ({ images }) => {
  return (
    <>
      {images.map((image, index) => (
        <div key={index} className="mt-2 max-h-64 rounded-md overflow-hidden">
          <img src={image.thumb} className="object-cover w-full" />
        </div>
      ))}
    </>
  );
};

const External: FC<{ external: ViewExternal }> = ({ external }) => {
  const url = new URL(external.uri);
  return (
    <div className="border border-gray-500 rounded-md w-full overflow-hidden mt-2">
      <a href={external.uri} target="_blank" rel="noreferrer">
        <img src={external.thumb} className="w-full max-h-64 object-cover" />
        <div className="px-3 py-2">
          <div className="text-gray-500 text-sm">{url.host}</div>
          <div className="font-semibold mb-2">{external.title}</div>
          <div className="text-sm line-clamp-2 overflow-hidden break-anywhere">
            {external.description}
          </div>
        </div>
      </a>
    </div>
  );
};

const Record: FC<{ record: ViewRecord }> = ({ record }) => {
  return (
    <div className="border border-gray-500 rounded-md w-full overflow-hidden mt-2">
      <div className="flex overflow-hidden break-words m-2">
        <div className="w-full">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full overflow-hidden mr-1">
                {record.author.avatar ? (
                  <img src={record.author.avatar} />
                ) : (
                  <div className="bg-blue-500">
                    <UserCircleIcon />
                  </div>
                )}
              </div>
              <span className="font-semibold">
                {record.author.displayName || record.author.handle}
              </span>
              <span className="text-sm font-mono pl-2 text-gray-400">
                @{record.author.handle}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <DistanceToNow date={record.indexedAt} />
            </div>
          </div>
          {isRecord(record.value) && (
            <div className="whitespace-pre-wrap">{record.value.text}</div>
          )}
          {record.embeds?.map((embed, index) => (
            <PostEmbed key={index} embed={embed} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PostEmbed: FC<{ embed?: EmbedViewUnion }> = ({ embed }) => {
  if (isImagesView(embed)) {
    return (
      <div className="pb-2">
        <Images images={embed.images} />
      </div>
    );
  }
  if (isExternalView(embed)) {
    return (
      <div className="pb-2">
        <External external={embed.external} />
      </div>
    );
  }
  if (isRecordView(embed)) {
    const record = embed.record;
    if (isViewRecord(record)) {
      return (
        <div className="pb-2">
          <Record record={record} />
        </div>
      );
    }
  }
  if (isRecordWithMediaView(embed)) {
    return (
      <div className="pb-2">
        {isImagesView(embed.media) && <Images images={embed.media.images} />}
        {isExternalView(embed.media) && (
          <External external={embed.media.external} />
        )}
        {isViewRecord(embed.record.record) && (
          <Record record={embed.record.record} />
        )}
      </div>
    );
  }
  return null;
};

export default PostEmbed;
