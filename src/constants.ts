export const EVENT_MENU_RELOAD = "tauri-reload";

export const Command = {
  GetAppdata: "get_appdata",
  SetAppdata: "set_appdata",
  GetSetting: "get_setting",
  SetSetting: "set_setting",
  Login: "login",
  Logout: "logout",
  Me: "me",
  GetProfile: "get_profile",
  GetFeedGenerators: "get_feed_generators",
  GetPosts: "get_posts",
  Subscribe: "subscribe",
  SubscribeNotification: "subscribe_notification",
  Unsubscribe: "unsubscribe",
  UnsubscribeNotification: "unsubscribe_notification",
  UpdateSeen: "update_seen",
  CreatePost: "create_post",
};
export type Command = (typeof Command)[keyof typeof Command];

export const AppdataKey = {
  Langs: "langs",
} as const;
export type AppdataKey = (typeof AppdataKey)[keyof typeof AppdataKey];

export const SettingKey = {
  Theme: "theme",
  Notification: "notification",
} as const;
export type SettingKey = (typeof SettingKey)[keyof typeof SettingKey];

export const EventName = {
  Post: "post",
  Notification: "notification",
  UnreadCount: "unread_count",
} as const;
export type EventName = (typeof EventName)[keyof typeof EventName];

export const Theme = {
  Dark: "dark",
  Light: "light",
} as const;
export type Theme = (typeof Theme)[keyof typeof Theme];

export const NotificationReason = {
  Like: "like",
  Repost: "repost",
  Follow: "follow",
  Mention: "mention",
  Reply: "reply",
  Quote: "quote",
} as const;
export type NotificationReason =
  (typeof NotificationReason)[keyof typeof NotificationReason];
