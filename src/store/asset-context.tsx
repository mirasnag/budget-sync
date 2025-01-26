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
  Asset,
  ContextType,
  ContextAction,
} from "../utils/types";

// Define the action types
type AssetAction = ContextAction<Asset>;

// Create the reducer function
const assetReducer = (state: Asset[], action: AssetAction): Asset[] => {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "ADD":
      return [...state, action.payload];
    case "DELETE":
      return state.filter((asset) => asset.id !== action.payload);
    case "EDIT":
      return state.map((asset) =>
        asset.id === action.payload.id
          ? { ...asset, [action.payload.prop]: action.payload.value }
          : asset
      );
    default:
      return state;
  }
};

export const AssetContext = createContext<ContextType<Asset> | undefined>(
  undefined
);

const initialValue = fetchData(CollectionType.ASSETS);

export const AssetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [assets, assetDispatch] = useReducer(assetReducer, initialValue);

  useEffect(() => {
    const fetchAssets = async () => {
      const fetchedData = fetchData(CollectionType.ASSETS) as Asset[];
      assetDispatch({ type: "INIT", payload: fetchedData });
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    localStorage.setItem(CollectionType.ASSETS, JSON.stringify(assets));
  }, [assets]);

  return (
    <AssetContext.Provider value={{ data: assets, dispatch: assetDispatch }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssetContext = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAssetContext must be used within a AssetProvider");
  }
  return context;
};
