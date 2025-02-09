import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

type AuthType = {
  email: string;
  token: string;
} | null;

type AuthContextAction =
  | { type: "LOGIN"; payload: AuthType }
  | { type: "LOGOUT"; payload: AuthType };

const AuthContext = createContext<{
  data: AuthType;
  dispatch: Dispatch<AuthContextAction>;
} | null>(null);

const AuthReducer = (state: AuthType, action: AuthContextAction): AuthType => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, authDispatch] = useReducer(AuthReducer, getUser());

  return (
    <AuthContext.Provider value={{ data: auth, dispatch: authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }

  return context;
};
