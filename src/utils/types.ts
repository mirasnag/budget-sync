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
  GOAL = "goal",
}

export const enum CollectionType {
  TRANSACTIONS = "transactions",
  CATEGORIES = "categories",
  ASSETS = "assets",
  GOALS = "goals",
  SOURCES = "sources",
}

export type DataItemType = TransactionType | EntityType | "transaction";

// Mapping between types and collections
export const typeToCollectionMap: Record<DataItemType, CollectionType> = {
  ["transaction"]: CollectionType.TRANSACTIONS,
  [TransactionType.EXPENSE]: CollectionType.TRANSACTIONS,
  [TransactionType.TRANSFER]: CollectionType.TRANSACTIONS,
  [TransactionType.INCOME]: CollectionType.TRANSACTIONS,
  [EntityType.CATEGORY]: CollectionType.CATEGORIES,
  [EntityType.ASSET]: CollectionType.ASSETS,
  [EntityType.SOURCE]: CollectionType.SOURCES,
  [EntityType.GOAL]: CollectionType.GOALS,
};

// Base Interfaces
export interface DataItemBase {
  id: string;
  type: DataItemType;
  name: string;
  metadata?: Record<string, unknown>;
}

export interface EntityBase extends DataItemBase {
  type: EntityType;
  currency: string;
  amount: number;
}

// Specific Entities
export interface Category extends EntityBase {
  type: EntityType.CATEGORY;
  // amount - budget amount for month
}

export interface Asset extends EntityBase {
  type: EntityType.ASSET;
  // amount - initial balance
}

export interface Source extends EntityBase {
  type: EntityType.SOURCE;
  // amount - not applicable
}

export interface Goal extends EntityBase {
  type: EntityType.GOAL;
  // amount - goal amount
}

// Transaction Interfaces
export interface TransactionNode {
  id: string;
}

export interface TransactionBase extends DataItemBase {
  type: TransactionType;
  src: TransactionNode;
  srcAmount: number;
  dst: TransactionNode;
  dstAmount: number;
  date: Date;
  createdAt: Date;
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
export type DataItem = Transaction | Entity | Goal;

// Other
export interface FormInput {
  [key: string]: string;
}

export interface CurrencyRates {
  [key: string]: number;
}
