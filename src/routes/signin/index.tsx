import Avatar from "@/components/Avatar";
import { Command } from "@/constants";
import { useProfiles } from "@/hooks/useProfiles";
import { Session } from "@/util";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";

const SigninIndex = () => {
  const sessions = useRouteLoaderData("signin") as Session[];
  const profiles = useProfiles(sessions.map((session) => session.did));
  const navigate = useNavigate();
  useEffect(() => {
    if (sessions.length === 0) navigate("/signin/new");
  }, []);
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
