import { ProfileViewDetailed } from "@/atproto/types/app/bsky/actor/defs";
import { Command } from "@/constants";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export function useProfiles(dids: string[]) {
  const [profiles, setProfiles] = useState<Map<string, ProfileViewDetailed>>(
    new Map()
  );
  const targets = dids.filter((did) => !profiles.has(did));
  useEffect(() => {
    if (targets.length === 0) return;
    (async () => {
      const results = await Promise.all(
        dids.map((did) =>
          invoke<ProfileViewDetailed>(Command.GetPublicProfile, { actor: did })
        )
      );
      setProfiles((prev) => {
        return new Map(
          [...prev.entries()].concat(
            results.map((result) => [result.did, result])
          )
        );
      });
    })();
  }, [targets]);
  return profiles;
}
