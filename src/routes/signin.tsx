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
      setMessage(e as string);
    }
  };

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          signin();
        }}
      >
        <p>
          <input
            id="identifier"
            onChange={(e) => setIdentifier(e.currentTarget.value)}
            placeholder="Enter an identifier..."
          />
        </p>
        <p>
          <input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
            placeholder="Enter an password..."
          />
        </p>
        <p>
          <button type="submit">Sign in</button>
        </p>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Signin;
