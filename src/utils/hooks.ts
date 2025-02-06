import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../store/auth-context";

// ui
export const useClickHandler = <T extends HTMLElement>({
  onInsideClick,
  onOutsideClick,
}: {
  onInsideClick?: (event: MouseEvent) => void;
  onOutsideClick?: (event: MouseEvent) => void;
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

// authorization
export const useLogin = () => {
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const login = async (
    email: string,
    password: string,
    action: "login" | "signup"
  ) => {
    // setIsLoading(true);
    setError(null);

    const response = await fetch(`/api/user/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: "LOGIN", payload: json });

      // update loading state
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT", payload: null });
  };

  return { logout };
};
