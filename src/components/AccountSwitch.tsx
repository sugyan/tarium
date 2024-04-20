import { ProfileViewDetailed } from "@/atproto/types/app/bsky/actor/defs";
import { Command } from "@/constants";
import { useProfiles } from "@/hooks/useProfiles";
import { Session } from "@/util";
import { UserMinusIcon } from "@heroicons/react/24/outline";
import { invoke } from "@tauri-apps/api/core";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";

function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  useEffect(() => {
    (async () => {
      setSessions(await invoke(Command.ListSessions));
    })();
  }, []);
  return sessions;
}

const Account: FC<{ handle: string; profile: ProfileViewDetailed | null }> = ({
  handle,
  profile,
}) => {
  return (
    <div className="px-2 py-2 flex items-center">
      <div className="mr-2">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          {profile && <Avatar avatar={profile?.avatar} />}
        </div>
      </div>
      <div className="break-all line-clamp-1 text-muted">
        {profile && profile.displayName && (
          <span className="mr-2 text-foreground">{profile.displayName}</span>
        )}
        {handle}
      </div>
    </div>
  );
};

const AccountSwitch: FC<{
  current: ProfileViewDetailed | null;
  onClose: () => void;
}> = ({ current, onClose }) => {
  const navigate = useNavigate();
  const sessions = useSessions().filter(
    (session) => session.did !== current?.did
  );
  const profiles = useProfiles(sessions.map((session) => session.did));
  const switchAccount = async (did: string) => {
    try {
      await invoke(Command.SwitchSession, { did });
      onClose();
      navigate("/", { state: { refresh: true } });
    } catch {
      navigate("/signin");
    }
  };
  const onSignout = async () => {
    await invoke(Command.Logout);
    navigate("/signin");
  };
  return (
    <div className="m-4 w-96">
      <div className="text-xl font-bold pb-2 border-b border-slate-500">
        Signed in as
      </div>
      <div className="my-2">
        {current && <Account handle={current.handle} profile={current} />}
      </div>
      <div className="text-lg font-semibold py-2 border-b border-slate-500">
        Switch
      </div>
      {sessions.map((session) => {
        return (
          <div
            key={session.did}
            className="border-b border-muted cursor-pointer h-14"
            onClick={() => switchAccount(session.did)}
          >
            <Account
              handle={session.handle}
              profile={profiles.get(session.did) || null}
            />
          </div>
        );
      })}
      <div className="text-muted bg-background rounded-lg">
        <div className="flex items-center cursor-pointer" onClick={onSignout}>
          <UserMinusIcon className="h-8 w-8 m-3 text-red-500" />
          Sign out
        </div>
      </div>
    </div>
  );
};

export default AccountSwitch;
