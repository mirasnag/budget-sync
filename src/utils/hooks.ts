import { useEffect, useRef } from "react";

type ClickHandler = (event: MouseEvent) => void;

export const useClickHandler = <T extends HTMLElement>({
  onInsideClick,
  onOutsideClick,
}: {
  onInsideClick?: ClickHandler;
  onOutsideClick?: ClickHandler;
}) => {
  const ref = useRef<T | null>(null);

  const handleClick = (event: MouseEvent) => {
    if (ref.current) {
      ref.current.contains(event.target as Node)
        ? onInsideClick?.(event)
        : onOutsideClick?.(event);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [onInsideClick, onOutsideClick]);

  return ref;
};
