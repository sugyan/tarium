import { UserCircleIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { ProfileView } from "../atproto/types/app/bsky/actor/defs";

const Avatar: FC<{ author: ProfileView }> = ({ author }) => {
  return author.avatar ? (
    <img src={author.avatar} />
  ) : (
    <div className="bg-blue-500">
      <UserCircleIcon />
    </div>
  );
};

export default Avatar;
