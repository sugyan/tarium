export const STORE_SETTING = "setting.json";
export const EVENT_MENU_RELOAD = "tauri-reload";

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
