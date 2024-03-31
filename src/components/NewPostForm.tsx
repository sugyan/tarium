import { invoke } from "@tauri-apps/api/core";
import { FC, useState } from "react";

const NewPostForm: FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const onPost = async () => {
    try {
      setSubmitting(true);
      await invoke("create_post", { text });
      onCancel();
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="mx-4 my-2">
      <div className="border-b border-slate-500 mb-2 flex justify-between">
        <button className="text-red-500" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="bg-blue-500 disabled:bg-blue-800 text-white disabled:text-muted font-semibold text-sm px-4 py-1 my-2 rounded-full"
          onClick={onPost}
          disabled={text.length === 0 || isSubmitting}
        >
          Post
        </button>
      </div>
      <textarea
        className="w-full border-2 border-slate-500 rounded bg-inherit resize-none p-2 focus:outline-none"
        rows={5}
        autoFocus={true}
        placeholder="What's up?"
        value={text}
        autoCorrect="off"
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="font-mono text-slate-500 text-right">
        {300 - text.length}
      </div>
    </div>
  );
};

export default NewPostForm;
