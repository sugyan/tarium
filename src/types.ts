export interface FeedViewPost {
  post: PostView;
  reason?: any; // TODO: FeedViewPostReasonEnum,
  reply?: any; // TODO: ReplyRef
}

export interface PostView {
  author: ProfileViewBasic;
  record: {
    createdAt: string;
    text: string;
    // TODO
  };
  // TODO
}

export interface ProfileViewBasic {
  avatar?: string;
  displayName?: string;
  handle: string;
}
