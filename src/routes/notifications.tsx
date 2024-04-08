import { ProfileView } from "@/atproto/types/app/bsky/actor/defs";
import { OutputSchema } from "@/atproto/types/app/bsky/feed/getPosts";
import { Notification } from "@/atproto/types/app/bsky/notification/listNotifications";
import Column from "@/components/Column";
import NotificationList from "@/components/NotificatinList";
import { Command, NotificationReason } from "@/constants";
import { useNotifications } from "@/hooks/useNotifications";
import { BellIcon } from "@heroicons/react/24/outline";
import { invoke } from "@tauri-apps/api/core";
import { differenceInDays } from "date-fns/fp/differenceInDays";
import { useEffect, useState } from "react";

interface NotificationGroup {
  key: string;
  uri?: string;
  reason: NotificationReason;
  indexedAt: string;
  authors: ProfileView[];
}

// group by reason, subject, and 2-day periods
function groupNotifications(notifications: Notification[]) {
  const groups: NotificationGroup[] = [];
  const index = new Map();
  const diff = differenceInDays(new Date());
  notifications.forEach((notification) => {
    const days2 = Math.floor(-diff(notification.indexedAt) / 2);
    const reason = notification.reason as NotificationReason;
    const uri =
      reason === NotificationReason.Mention ||
      reason === NotificationReason.Reply ||
      reason === NotificationReason.Quote
        ? notification.uri
        : notification.reasonSubject;
    const key = `${days2}:${reason},${uri || ""}`;
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
      const output = await invoke<OutputSchema>(Command.GetPosts, {
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
  useEffect(() => {
    const latest = notifications[0];
    if (latest) {
      (async () => {
        await invoke(Command.UpdateSeen);
      })();
    }
  }, [notifications]);
  const headerContent = (
    <>
      <div className="h-6 w-6">
        <div className="h-6 flex justify-center items-center">
          <BellIcon className="h-6 w-6" />
        </div>
      </div>
      <span className="ml-2 font-semibold">Notifications</span>
    </>
  );
  return (
    <Column headerContent={headerContent}>
      <NotificationList groups={groups} posts={posts} />
    </Column>
  );
};

export default Notifications;
