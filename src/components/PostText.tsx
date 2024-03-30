import { FC, Fragment } from "react";
import { Record } from "../atproto/types/app/bsky/feed/post";
import { Main, isLink } from "../atproto/types/app/bsky/richtext/facet";

const ranges = (facets: Main[], length: number): [number, number][] => {
  // TODO: intersection?
  const points = Array.from(
    new Set(
      facets.flatMap((facet) => [facet.index.byteStart, facet.index.byteEnd])
    )
  ).sort((a, b) => a - b);
  const v: [number, number][] = [];
  let prev = 0;
  points.forEach((p) => {
    v.push([prev, p]);
    prev = p;
  });
  v.push([prev, length]);
  return v.filter(([start, end]) => start !== end);
};

const PostText: FC<{ record: Record }> = ({ record }) => {
  const facets = record.facets || [];
  const encoded = new TextEncoder().encode(record.text);
  const decoder = new TextDecoder();
  const elements = ranges(facets, encoded.length)
    .filter(([start, end]) => start !== end)
    .map(([start, end]) => {
      const decoded = decoder.decode(encoded.slice(start, end));
      const facet = facets.find((facet) => {
        return facet.index.byteStart === start && facet.index.byteEnd === end;
      });
      if (facet) {
        const link = facet.features.find(isLink);
        if (link) {
          const shorten = (uri: string) => {
            const url = new URL(uri);
            const pathname =
              url.pathname.length > 13
                ? url.pathname.slice(0, 13) + "..."
                : url.pathname;
            return `${url.host}${pathname}`;
          };
          const uri = link.uri === decoded ? shorten(link.uri) : decoded;
          return (
            <a href={link.uri} target="_blank" className="text-blue-500">
              {uri}
            </a>
          );
        } else {
          return (
            <span className="text-blue-500 cursor-pointer">{decoded}</span>
          );
        }
      } else {
        return <>{decoded}</>;
      }
    });
  return (
    <div className="whitespace-pre-wrap">
      {elements.map((e, index) => {
        return <Fragment key={index}>{e}</Fragment>;
      })}
    </div>
  );
};

export default PostText;
