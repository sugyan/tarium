import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Root = () => {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        await invoke("get_session", {});
        navigate("/home");
      } catch (e) {
        navigate("/signin");
      }
    })();
  }, []);
  return <p>Root</p>;
};

export default Root;
