import { ProfileViewDetailed } from "@/atproto/types/app/bsky/actor/defs";
import Avatar from "@/components/Avatar";
import { FocusContext } from "@/components/Modal";
import { AppdataKey, Command } from "@/constants";
import { LANGUAGES } from "@/data/languages";
import { Popover, Transition } from "@headlessui/react";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { invoke } from "@tauri-apps/api/core";
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";

const Languages: FC<{
  langs: Set<string>;
  onChange: (_: ChangeEvent<HTMLInputElement>) => void;
}> = ({ langs, onChange }) => {
  return (
    <Popover className="flex relative">
      <Popover.Button>
        <div className="flex items-center">
          <LanguageIcon className="h-6 w-6 cursor-pointer mr-1" />
          {[...langs].sort().join(", ")}
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
          <div className="text-muted bg-background border border-more-muted h-64 w-64 rounded-lg">
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
                          onChange={onChange}
                        />
                        <label
                          htmlFor={v.code}
                          className="ms-2 text-sm font-medium text-muted line-clamp-1 cursor-pointer"
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
  );
};

const NewPostForm: FC<{
  profile: ProfileViewDetailed | null;
  onClose: () => void;
}> = ({ profile, onClose: onCancel }) => {
  const focusRef = useContext(FocusContext);
  const [text, setText] = useState("");
  const [langs, setLangs] = useState<Set<string>>(new Set());
  const [isSubmitting, setSubmitting] = useState(false);
  useEffect(() => {
    (async () => {
      const langs = await invoke<string[] | null>(Command.GetAppdata, {
        key: AppdataKey.Langs,
      });
      setLangs(new Set(langs));
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
        await invoke(Command.SetAppdata, {
          key: AppdataKey.Langs,
          value: [...set].sort(),
        });
      })();
      return new Set(set);
    });
  };
  const onPost = async () => {
    try {
      setSubmitting(true);
      await invoke(Command.CreatePost, { text, langs: [...langs] });
      onCancel();
    } finally {
      setSubmitting(false);
    }
  };
  const isTooLong = text.length > 300;
  return (
    <div className="mx-4 my-2 w-[512px]">
      <div className="border-b border-more-muted mb-2 flex justify-between">
        <button className="text-red-500" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="bg-blue-500 disabled:bg-blue-800 text-white disabled:text-muted font-semibold text-sm px-4 py-1 my-2 rounded-full"
          onClick={onPost}
          disabled={text.length === 0 || isTooLong || isSubmitting}
        >
          Post
        </button>
      </div>
      <div className="flex items-start">
        <div className="m-2">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <Avatar avatar={profile?.avatar} />
          </div>
        </div>
        <textarea
          ref={focusRef}
          className="w-full rounded bg-inherit resize-none p-2 focus:outline-none"
          rows={5}
          placeholder="What's up?"
          value={text}
          autoCorrect="off"
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      <div className="flex justify-end items-center text-muted mt-2">
        <Languages langs={langs} onChange={onChangeLangs} />
        <div className="ml-2 text-base font-mono">
          <span className={isTooLong ? "text-red-500" : "text-muted"}>
            {300 - text.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewPostForm;
