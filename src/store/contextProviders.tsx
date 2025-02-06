import { ReactNode } from "react";

import {
  TransactionProvider,
  useTransactionContext,
} from "./transaction-context";
import { AssetProvider, useAssetContext } from "./asset-context";
import { CategoryProvider, useCategoryContext } from "./category-context";
import { SourceProvider, useSourceContext } from "./source-context";
import { AuthProvider } from "./auth-context";

import {
  CollectionType,
  DataItem,
  DataItemType,
  typeToCollectionMap,
} from "../utils/types";

const contextMap = {
  [CollectionType.TRANSACTIONS]: useTransactionContext,
  [CollectionType.ASSETS]: useAssetContext,
  [CollectionType.CATEGORIES]: useCategoryContext,
  [CollectionType.SOURCES]: useSourceContext,
};

export const getContextData = <C extends CollectionType>(collection: C) => {
  const contextHook = contextMap[collection];

  if (!contextHook) {
    throw new Error(`Invalid context type: ${collection}`);
  }

  return contextHook();
};

export const getItemById = <T extends DataItemType>(
  type: T,
  id?: string
): DataItem => {
  const collectionType = typeToCollectionMap[type];
  const { data } = getContextData(collectionType);
  const filteredData = data.filter((d: DataItem) => d.id === id);
  return filteredData[0];
};

export const ContextProviders: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <TransactionProvider>
        <AssetProvider>
          <CategoryProvider>
            <SourceProvider>{children}</SourceProvider>
          </CategoryProvider>
        </AssetProvider>
      </TransactionProvider>
    </AuthProvider>
  );
};
