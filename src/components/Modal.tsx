import { ThemeContext } from "@/App";
import { Dialog, Transition } from "@headlessui/react";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react";
import { Fragment } from "react/jsx-runtime";

export const FocusContext = createContext({
  current: null,
});

const Modal: FC<
  PropsWithChildren<{ isShow: boolean; setShow: (_: boolean) => void }>
> = ({ isShow, setShow, children }) => {
  const ref = useRef(null);
  const { theme } = useContext(ThemeContext);
  return (
    <Transition show={isShow} as={Fragment}>
      <Dialog
        initialFocus={ref}
        onClose={() => setShow(false)}
        className={`relative z-10 ${theme}`}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm backdrop-contrast-75" />
        </Transition.Child>
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Panel className="min-h-64 min-w-96 rounded shadow-lg shadow-slate-900 text-foreground bg-background">
              <FocusContext.Provider value={ref}>
                {children}
              </FocusContext.Provider>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
