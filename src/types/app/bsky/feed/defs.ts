import { ProfileViewBasic } from "../actor/defs";

export interface PostView {
  uri: string;
  cid: string;
  author: ProfileViewBasic;
  record: {
    createdAt: string;
    text: string;
  }; // TODO
  // embed?:
  //   | AppBskyEmbedImages.View
  //   | AppBskyEmbedExternal.View
  //   | AppBskyEmbedRecord.View
  //   | AppBskyEmbedRecordWithMedia.View
  //   | { $type: string; [k: string]: unknown }
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  indexedAt: string;
  // viewer?: ViewerState
  // labels?: ComAtprotoLabelDefs.Label[]
  // threadgate?: ThreadgateView
}

export interface FeedViewPost {
  post: PostView;
  reply?: any; // TODO
  reason?: any; // TODO
}
