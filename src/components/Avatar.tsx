import { UserCircleIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

const Avatar: FC<{ avatar?: string }> = ({ avatar }) => {
  return avatar ? (
    <img src={avatar} />
  ) : (
    <div className="bg-blue-500 text-white">
      <UserCircleIcon />
    </div>
  );
};

export default Avatar;
