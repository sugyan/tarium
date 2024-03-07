import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const signin = async () => {
    try {
      const result = await invoke("sign_in", { identifier, password });
      setMessage(JSON.stringify(result));
    } catch (err) {
      setMessage(err as string);
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
}

export default App;
