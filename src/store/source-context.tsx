import React, {
  createContext,
  useReducer,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { fetchData } from "../utils/services";
import {
  CollectionType,
  ContextAction,
  ContextType,
  Source,
} from "../utils/types";

type SourceAction = ContextAction<Source>;

// Create the reducer function
const sourceReducer = (state: Source[], action: SourceAction): Source[] => {
  switch (action.type) {
    case "INIT":
      return action.payload;
    default:
      return state;
  }
};

const SourceContext = createContext<ContextType<Source> | undefined>(undefined);

const initialValue = fetchData(CollectionType.SOURCES);

export const SourceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sources, sourceDispatch] = useReducer(sourceReducer, initialValue);

  useEffect(() => {
    const fetchSources = async () => {
      const fetchedData = fetchData(CollectionType.SOURCES) as Source[];
      sourceDispatch({ type: "INIT", payload: fetchedData });
    };
    fetchSources();
  }, []);

  useEffect(() => {
    localStorage.setItem(CollectionType.SOURCES, JSON.stringify(sources));
  }, [sources]);

  return (
    <SourceContext.Provider value={{ data: sources, dispatch: sourceDispatch }}>
      {children}
    </SourceContext.Provider>
  );
};

export const useSourceContext = () => {
  const context = useContext(SourceContext);
  if (!context) {
    throw new Error("useSourceContext must be used within a SourceProvider");
  }
  return context;
};
