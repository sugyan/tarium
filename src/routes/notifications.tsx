import { ProfileView } from "@/atproto/types/app/bsky/actor/defs";
import { OutputSchema as GetFeedGeneratorsOutput } from "@/atproto/types/app/bsky/feed/getFeedGenerators";
import { OutputSchema as GetPostsOutput } from "@/atproto/types/app/bsky/feed/getPosts";
import { Notification } from "@/atproto/types/app/bsky/notification/listNotifications";
import Column from "@/components/Column";
import NotificationList from "@/components/NotificationList";
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

async function getPosts(uris: string[]) {
  if (uris.length === 0) return [];
  const output = await invoke<GetPostsOutput>(Command.GetPosts, {
    uris,
  });
  return output.posts.map((p) => ({
    ...p,
    $type: "app.bsky.feed.defs#postView",
  }));
}

async function getGenerators(uris: string[]) {
  if (uris.length === 0) return [];
  const output = await invoke<GetFeedGeneratorsOutput>(
    Command.GetFeedGenerators,
    {
      feeds: uris,
    }
  );
  return output.feeds.map((p) => ({
    ...p,
    $type: "app.bsky.feed.defs#generatorView",
  }));
}

function useGetUriContents(notificationGroups: NotificationGroup[]) {
  const [contents, setContents] = useState(new Map());
  // extract only unknown uris
  const uris = [
    ...new Set(
      notificationGroups
        .map((group) => group.uri)
        .filter((uri): uri is string => uri !== undefined && !contents.has(uri))
    ),
  ];
  useEffect(() => {
    if (uris.length === 0) return;
    // just add keys (with value `null`)
    setContents((prev) => {
      return new Map(
        [...prev.entries()].concat(uris.map((uri) => [uri, null]))
      );
    });
    // fetch contents
    (async () => {
      (
        await Promise.all([
          getPosts(uris.filter((uri) => uri.includes("app.bsky.feed.post"))),
          getGenerators(
            uris.filter((uri) => uri.includes("app.bsky.feed.generator"))
          ),
        ])
      ).forEach((output) => {
        setContents(
          (prev) =>
            new Map(
              [...prev.entries()].concat(output.map((out) => [out.uri, out]))
            )
        );
      });
    })();
  }, [uris]);
  return contents;
}

const Notifications = () => {
  const notifications = useNotifications();
  const groups = groupNotifications(notifications);
  const contents = useGetUriContents(groups);
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
      <NotificationList groups={groups} contents={contents} />
    </Column>
  );
};

export default Notifications;
