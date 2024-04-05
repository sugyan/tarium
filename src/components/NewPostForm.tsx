import { AppdataKey, STORE_APPDATA } from "@/constants";
import { LANGUAGES } from "@/data/languages";
import { Popover, Transition } from "@headlessui/react";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { invoke } from "@tauri-apps/api/core";
import { Store } from "@tauri-apps/plugin-store";
import { ChangeEvent, FC, useEffect, useState } from "react";

const NewPostForm: FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const [text, setText] = useState("");
  const [langs, setLangs] = useState(new Set());
  const [isSubmitting, setSubmitting] = useState(false);
  useEffect(() => {
    (async () => {
      const store = new Store(STORE_APPDATA);
      setLangs(new Set(await store.get(AppdataKey.Lang)));
    })();
  }, []);
  const onChangeLangs = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    setLangs((set) => {
      if (checked) {
        set.add(id);
      } else {
        set.delete(id);
      }
      (async () => {
        const store = new Store(STORE_APPDATA);
        await store.set(AppdataKey.Lang, Array.from(set).sort());
        await store.save();
      })();
      return new Set(set);
    });
  };
  const onPost = async () => {
    try {
      setSubmitting(true);
      await invoke("create_post", { text, langs: Array.from(langs) });
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
      <div className="flex justify-end items-center text-muted mt-2">
        <Popover className="flex relative">
          <Popover.Button>
            <div className="flex items-center">
              <LanguageIcon className="h-6 w-6 cursor-pointer mr-1" />
              {Array.from(langs).sort().join(", ")}
            </div>
          </Popover.Button>
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute top-10 right-0">
              <div className="bg-more-muted text-foreground h-64 w-64 rounded">
                <div className="p-2 h-full flex flex-col">
                  Language
                  <div className="mt-3 h-full overflow-y-auto">
                    {LANGUAGES.map((v) => {
                      return (
                        <div key={v.code} className="m-2 border-b border-muted">
                          <div className="flex items-center my-3">
                            <input
                              id={v.code}
                              type="checkbox"
                              className="min-w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              checked={langs.has(v.code)}
                              onChange={onChangeLangs}
                            />
                            <label
                              htmlFor={v.code}
                              className="ms-2 text-sm font-medium text-foreground line-clamp-1 cursor-pointer"
                            >
                              {v.name}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
        <div className="ml-2 text-base font-mono text-slate-500">
          {300 - text.length}
        </div>
      </div>
    </div>
  );
};

export default NewPostForm;
