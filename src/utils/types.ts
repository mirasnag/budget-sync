// Enums for stricter type safety
export const enum TransactionType {
  EXPENSE = "expense",
  TRANSFER = "transfer",
  INCOME = "income",
}

export const enum EntityType {
  CATEGORY = "category",
  ASSET = "asset",
  SOURCE = "source",
}

export const enum CollectionType {
  TRANSACTIONS = "transactions",
  CATEGORIES = "categories",
  ASSETS = "assets",
  SOURCES = "sources",
}

export type DataItemType = TransactionType | EntityType;

// Mapping between types and collections
export const typeToCollectionMap: Record<DataItemType, CollectionType> = {
  [TransactionType.EXPENSE]: CollectionType.TRANSACTIONS,
  [TransactionType.TRANSFER]: CollectionType.TRANSACTIONS,
  [TransactionType.INCOME]: CollectionType.TRANSACTIONS,
  [EntityType.CATEGORY]: CollectionType.CATEGORIES,
  [EntityType.ASSET]: CollectionType.ASSETS,
  [EntityType.SOURCE]: CollectionType.SOURCES,
};

// Base Interfaces
export interface DataItemBase {
  id: string;
  type: DataItemType;
  name: string;
}

export interface EntityBase extends DataItemBase {
  type: EntityType;
  currency?: string;
}

// Specific Entities
export interface Category extends EntityBase {
  type: EntityType.CATEGORY;
  amount: number; // budget amount for month
}

export interface Asset extends EntityBase {
  type: EntityType.ASSET;
}

export interface Source extends EntityBase {
  type: EntityType.SOURCE;
}

// Transaction Interfaces
export interface TransactionBase extends DataItemBase {
  type: TransactionType;
  src?: string;
  dst?: string;
  srcAmount?: number;
  dstAmount?: number;
  date_utc?: string; // ISO string
}

export interface Expense extends TransactionBase {
  type: TransactionType.EXPENSE;
}

export interface Transfer extends TransactionBase {
  type: TransactionType.TRANSFER;
}

export interface Income extends TransactionBase {
  type: TransactionType.INCOME;
}

// Unified Entity and Data Item Types
export type Transaction = Expense | Transfer | Income;
export type Entity = Category | Asset | Source;
export type DataItem = Transaction | Entity;

// Other
export interface FormInput {
  [key: string]: string;
}

export interface CurrencyRates {
  [key: string]: number;
}

// Context
type EditPayload<T> = T extends DataItem
  ? { id: string; prop: keyof T; value: T[keyof T] }
  : never;

export type ContextAction<T extends DataItem> =
  | { type: "INIT"; payload: T[] }
  | { type: "ADD"; payload: T }
  | { type: "DELETE"; payload: string }
  | {
      type: "EDIT";
      payload: EditPayload<T>;
    };

export interface ContextType<T extends DataItem> {
  data: T[];
  dispatch: React.Dispatch<ContextAction<T>>;
}
