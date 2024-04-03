import { Transition } from "@headlessui/react";
import { throttle } from "lodash";
import {
  FC,
  PropsWithChildren,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const Column: FC<PropsWithChildren<{ headerContent: ReactNode }>> = ({
  headerContent,
  children,
}) => {
  const [isShowing, setShowing] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const scrollTop = useRef(0);
  const onScroll = useCallback(
    throttle((event: SyntheticEvent<HTMLDivElement>) => {
      if (!event.currentTarget) return;
      const prev = scrollTop.current;
      const curr = event.currentTarget.scrollTop;
      if (prev > curr) {
        setShowing(true);
      } else if (curr > 100) {
        setShowing(false);
      }
      scrollTop.current = curr;
    }, 50),
    []
  );
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div
      onScroll={onScroll}
      className="overflow-y-scroll h-screen focus:outline-none"
      tabIndex={-1}
      ref={ref}
    >
      <Transition
        show={isShowing}
        enter="transition ease-in-out duration-500 transform"
        enterFrom="-translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease-in-out duration-500 transform"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-full opacity-0"
        className="flex items-center p-2 w-full fixed h-12 border-b border-muted bg-background z-10"
      >
        {headerContent}
      </Transition>
      <div className="mt-12">{children}</div>
    </div>
  );
};

export default Column;
