import { Outlet } from "react-router-dom";

const Signin = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Signin;
