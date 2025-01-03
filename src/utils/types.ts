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
}

// Specific Entities
export interface Category extends EntityBase {
  type: EntityType.CATEGORY;
  totalBudgeted: number;
}

export interface Asset extends EntityBase {
  type: EntityType.ASSET;
  initBalance: number;
}

export interface Source extends EntityBase {
  type: EntityType.SOURCE;
}

export interface Goal extends EntityBase {
  type: EntityType.GOAL;
  amount: number;
}

// Transaction Interfaces
interface TransactionNode {
  type: EntityType;
  id: string;
  amount: number;
}

export interface TransactionBase extends DataItemBase {
  type: TransactionType;
  src: TransactionNode;
  dst: TransactionNode;
  date: Date;
  createdAt: Date;
}

export interface Expense extends TransactionBase {
  type: TransactionType.EXPENSE;
  src: TransactionNode & { type: EntityType.ASSET };
  dst: TransactionNode & { type: EntityType.CATEGORY };
}

export interface Transfer extends TransactionBase {
  type: TransactionType.TRANSFER;
  src: TransactionNode & { type: EntityType.ASSET };
  dst: TransactionNode & { type: EntityType.ASSET };
}

export interface Income extends TransactionBase {
  type: TransactionType.INCOME;
  src: TransactionNode & { type: EntityType.SOURCE };
  dst: TransactionNode & { type: EntityType.ASSET };
}

// Unified Entity and Data Item Types
export type Transaction = Expense | Transfer | Income;
export type Entity = Category | Asset | Source | Goal;
export type DataItem = Transaction | Entity;

// Other
export interface FormInput {
  [key: string]: string;
}

export interface CurrencyRates {
  [key: string]: number;
}
