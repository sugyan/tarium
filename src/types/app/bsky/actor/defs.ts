export interface ProfileViewBasic {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
  viewer?: ViewerState;
  // labels?: ComAtprotoLabelDefs.Label[]
}

export interface ViewerState {
  muted?: boolean;
  // mutedByList?: AppBskyGraphDefs.ListViewBasic
  blockedBy?: boolean;
  blocking?: string;
  // blockingByList?: AppBskyGraphDefs.ListViewBasic
  following?: string;
  followedBy?: string;
}
