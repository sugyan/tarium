import { Notification } from "@/atproto/types/app/bsky/notification/listNotifications";
import { EventName } from "@/constants";
import { invoke } from "@tauri-apps/api/core";
import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unlisten = useRef<UnlistenFn>(() => {});
  useEffect(() => {
    (async () => {
      unlisten.current = await listen<Notification>(
        EventName.Notification,
        (event) => {
          const payload = event.payload;
          setNotifications((prev) =>
            prev.some((n) => n.cid === payload.cid) ? prev : [payload, ...prev]
          );
        }
      );
    })();
    return () => {
      unlisten.current();
      (async () => {
        await invoke("unsubscribe", {});
      })();
    };
  }, []);
  useEffect(() => {
    setNotifications([]);
    (async () => {
      await invoke("subscribe", { subscription: "notification" });
    })();
  }, []);
  return notifications;
}
