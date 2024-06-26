import {
  View as ExternalView,
  ViewExternal,
  isView as isExternalView,
} from "@/atproto/types/app/bsky/embed/external";
import {
  View as ImagesView,
  ViewImage,
  isView as isImagesView,
} from "@/atproto/types/app/bsky/embed/images";
import {
  View as RecordView,
  ViewRecord,
  isView as isRecordView,
  isViewRecord,
} from "@/atproto/types/app/bsky/embed/record";
import {
  View as RecordWithMediaView,
  isView as isRecordWithMediaView,
} from "@/atproto/types/app/bsky/embed/recordWithMedia";
import {
  GeneratorView,
  isGeneratorView,
} from "@/atproto/types/app/bsky/feed/defs";
import { isRecord } from "@/atproto/types/app/bsky/feed/post";
import Avatar from "@/components/Avatar";
import DistanceToNow from "@/components/DistanceToNow";
import { RssIcon } from "@heroicons/react/24/solid";
import { FC } from "react";

export type EmbedView =
  | ExternalView
  | ImagesView
  | RecordView
  | RecordWithMediaView;

const Images: FC<{ images: ViewImage[] }> = ({ images }) => {
  return (
    <>
      {images.map((image, index) => (
        <div key={index} className="mt-2 max-h-64 rounded-md overflow-hidden">
          <a href={image.fullsize} target="_blank" rel="noreferrer">
            <img src={image.thumb} className="object-cover w-full" />
          </a>
        </div>
      ))}
    </>
  );
};

const External: FC<{ external: ViewExternal }> = ({ external }) => {
  const url = new URL(external.uri);
  return (
    <div className="border border-slate-500 rounded-md w-full overflow-hidden mt-2">
      <a href={external.uri} target="_blank" rel="noreferrer">
        <img src={external.thumb} className="w-full max-h-64 object-cover" />
        <div className="px-3 py-2">
          <div className="text-slate-500 text-sm">{url.host}</div>
          <div className="font-semibold mb-2 break-all">
            {external.title || url.toString()}
          </div>
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
    <div className="border border-slate-500 rounded-md w-full overflow-hidden mt-2">
      <div className="flex overflow-hidden break-all m-2">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center pr-2">
              <div className="mr-1">
                <div className="h-5 w-5 rounded-full overflow-hidden">
                  <Avatar avatar={record.author.avatar} />
                </div>
              </div>
              <div className="break-all line-clamp-1 text-muted">
                <span className="font-semibold text-foreground">
                  {record.author.displayName || record.author.handle}
                </span>
                <span className="text-sm font-mono pl-2">
                  @{record.author.handle}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted whitespace-nowrap">
              <DistanceToNow date={record.indexedAt} />
            </div>
          </div>
          {isRecord(record.value) && (
            <div className="whitespace-pre-wrap">{record.value.text}</div>
          )}
          {record.embeds?.map((embed, index) => (
            <PostEmbed key={index} embed={embed as EmbedView} />
          ))}
          <div className="flex mt-2">
            {record.repostCount ? (
              <div className="mr-2">
                <span className="font-semibold">{record.repostCount}</span>{" "}
                <span className="text-muted">
                  {record.repostCount > 1 ? "reposts" : "repost"}
                </span>
              </div>
            ) : null}
            {record.likeCount ? (
              <div>
                <span className="font-semibold">{record.likeCount}</span>{" "}
                <span className="text-muted">
                  {record.likeCount > 1 ? "likes" : "like"}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Generator: FC<{ generator: GeneratorView }> = ({ generator }) => {
  return (
    <div className="border border-slate-500 rounded-md w-full mt-2">
      <div className="break-all m-2">
        <div className="flex">
          <div className="h-9 w-9 rounded-md overflow-hidden mt-0.5">
            {generator.avatar ? (
              <img src={generator.avatar} />
            ) : (
              <div className="bg-blue-500 p-0.5">
                <RssIcon className="text-white" />
              </div>
            )}
          </div>
          <div className="text-sm ml-2">
            <span className="font-semibold">{generator.displayName}</span>
            <div className="text-muted">
              Feed by @{generator.creator.handle}
            </div>
          </div>
        </div>
        <div className="text-sm text-muted mt-1">
          Liked by {generator.likeCount || 0} users
        </div>
      </div>
    </div>
  );
};

const PostEmbed: FC<{ embed?: EmbedView }> = ({ embed }) => {
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
    if (isGeneratorView(record)) {
      return (
        <div className="pb-2">
          <Generator generator={record} />
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
