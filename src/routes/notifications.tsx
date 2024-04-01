import { BellIcon } from "@heroicons/react/24/outline";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { ProfileView } from "../atproto/types/app/bsky/actor/defs";
import { OutputSchema } from "../atproto/types/app/bsky/feed/getPosts";
import { Notification } from "../atproto/types/app/bsky/notification/listNotifications";
import NotificationList from "../components/NotificatinList";
import { NotificationReason } from "../constants";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationGroup {
  key: string;
  uri: string | undefined;
  reason: NotificationReason;
  indexedAt: string;
  authors: ProfileView[];
}

function groupNotifications(notifications: Notification[]) {
  const groups: NotificationGroup[] = [];
  const index = new Map();
  notifications.forEach((notification) => {
    const reason = notification.reason as NotificationReason;
    const uri =
      reason === NotificationReason.Mention ||
      reason === NotificationReason.Quote ||
      reason === NotificationReason.Reply
        ? notification.uri
        : notification.reasonSubject;
    const key = [reason, notification.reasonSubject].join(",");
    const i = index.get(key);
    if (i !== undefined) {
      groups[i].authors.push(notification.author);
    } else {
      index.set(key, groups.length);
      groups.push({
        key,
        uri,
        reason,
        indexedAt: notification.indexedAt,
        authors: [notification.author],
      });
    }
  });
  return groups;
}

function useGetPosts(notificationGroups: NotificationGroup[]) {
  const [postViews, setPostViews] = useState(new Map());
  // extract only unknown uris
  const uris = Array.from(
    notificationGroups.reduce((acc, n) => {
      if (n.uri && !postViews.has(n.uri)) {
        acc.add(n.uri);
      }
      return acc;
    }, new Set())
  );
  useEffect(() => {
    if (uris.length === 0) return;
    (async () => {
      // just add keys (with value `null`)
      setPostViews((prev) => {
        return new Map(
          Array.from(prev.entries()).concat(uris.map((uri) => [uri, null]))
        );
      });
      const output = await invoke<OutputSchema>("get_posts", {
        uris,
      });
      // set values
      setPostViews((prev) => {
        return new Map(
          Array.from(prev.entries()).concat(output.posts.map((p) => [p.uri, p]))
        );
      });
    })();
  }, [uris]);
  return postViews;
}

const Notifications = () => {
  const notifications = useNotifications();
  const groups = groupNotifications(notifications);
  const posts = useGetPosts(groups);
  return (
    <>
      <div className="flex items-center p-2 border-b border-muted sticky top-0 bg-background z-10">
        <div className="h-6 w-6">
          <div className="h-6 flex justify-center items-center">
            <BellIcon className="h-6 w-6" />
          </div>
        </div>
        <span className="ml-2 font-semibold">Notifications</span>
      </div>
      <NotificationList groups={groups} posts={posts} />
    </>
  );
};

export default Notifications;
