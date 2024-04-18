import { Command } from "@/constants";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SigninNew = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const signin = async () => {
    try {
      await invoke(Command.Login, { identifier, password });
      navigate("/");
    } catch (e) {
      console.error(e);
      setMessage("Invalid identifier or password");
    }
  };
  return (
    <>
      <form
        className="flex flex-col space-y-4 w-72"
        onSubmit={(e) => {
          e.preventDefault();
          signin();
        }}
      >
        <input
          type="text"
          className="px-4 py-2 border text-slate-800 border-muted rounded-md"
          placeholder="Identifier"
          spellCheck={false}
          autoCorrect="off"
          onChange={(e) => setIdentifier(e.currentTarget.value)}
        />
        <input
          type="password"
          className="px-4 py-2 border text-slate-800 border-muted rounded-md"
          placeholder="Password"
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Sign in
        </button>
      </form>
      <div className="py-4 text-left">
        <button
          className="border border-more-muted rounded p-2 text-muted"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <div className=" text-red-500 text-center">{message}</div>
    </>
  );
};

export default SigninNew;
