import { ProfileViewDetailed } from "@/atproto/types/app/bsky/actor/defs";
import { OutputSchema } from "@/atproto/types/com/atproto/server/createSession";
import Avatar from "@/components/Avatar";
import { Command } from "@/constants";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function useSessions() {
  const [sessions, setSessions] = useState<OutputSchema[]>([]);
  useEffect(() => {
    (async () => {
      setSessions(await invoke(Command.ListSessions));
    })();
  }, []);
  return sessions;
}

function useProfiles(sessions: OutputSchema[]) {
  const [profiles, setProfiles] = useState<Map<string, ProfileViewDetailed>>(
    new Map()
  );
  const dids = sessions
    .map((session) => session.did)
    .filter((did) => !profiles.has(did));
  useEffect(() => {
    if (dids.length === 0) return;
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
  }, [dids]);
  return profiles;
}

const SigninIndex = () => {
  const sessions = useSessions();
  const profiles = useProfiles(sessions);
  const navigate = useNavigate();
  const onClickSession = async (did: string) => {
    try {
      await invoke(Command.SwitchSession, { did });
      navigate("/");
    } catch {}
  };
  return (
    <div>
      <h1 className="text-4xl text-center font-bold text-blue-500 mb-8">
        Sign in
      </h1>
      <ul className="border border-muted rounded-lg w-96">
        {sessions.map((session) => {
          const profile = profiles.get(session.did);
          return (
            <li
              className="px-2 py-4 border-b border-muted flex items-center cursor-pointer"
              key={session.did}
              onClick={() => onClickSession(session.did)}
            >
              <div className="mx-2">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  {profile && <Avatar avatar={profile?.avatar} />}
                </div>
              </div>
              <div className="break-all line-clamp-1 text-muted">
                {profile && profile.displayName && (
                  <span className="mr-2 text-foreground">
                    {profile.displayName}
                  </span>
                )}
                {session.handle}
              </div>
            </li>
          );
        })}
        <Link to="/signin/new">
          <li className="px-2 py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 mx-2" />
              Other account
            </div>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default SigninIndex;
