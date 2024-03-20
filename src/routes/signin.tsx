import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const signin = async () => {
    try {
      await invoke("login", { identifier, password });
      navigate("/home");
    } catch (e) {
      console.error(e);
      setMessage("Invalid identifier or password");
    }
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col p-8">
        <h1 className="text-4xl mb-8 text-center">Tarium</h1>
        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            signin();
          }}
        >
          <input
            type="text"
            className="px-4 py-2 border rounded-md text-gray-800"
            placeholder="Identifier"
            spellCheck={false}
            autoCorrect="off"
            onChange={(e) => setIdentifier(e.currentTarget.value)}
          />
          <input
            type="password"
            className="px-4 py-2 border rounded-md text-gray-800"
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
        <div className="py-3 h-6 text-red-500 text-center">{message}</div>
      </div>
    </div>
  );
};

export default Signin;
