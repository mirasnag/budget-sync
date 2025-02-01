// Interfaces
import {
  Asset,
  Category,
  CollectionType,
  DataItem,
  EntityType,
  Expense,
  Income,
  Transaction,
  TransactionType,
  Transfer,
  typeToCollectionMap,
} from "./types";

export const fetchData = (
  collection: CollectionType | "currencyRatesCache"
) => {
  const data = localStorage.getItem(collection);
  return data ? JSON.parse(data) : [];
};

export const deleteItem = (collectionType: CollectionType, id: string) => {
  const collection = fetchData(collectionType) as DataItem[];
  const newData = collection.filter((d) => d.id !== id);
  return localStorage.setItem(collectionType, JSON.stringify(newData));
};

export const createItem = (newItem: DataItem) => {
  const collectionType = typeToCollectionMap[newItem.type];
  const collection = fetchData(collectionType) as DataItem[];
  return localStorage.setItem(
    collectionType,
    JSON.stringify([...collection, newItem])
  );
};

export const createEmptyAsset = () => {
  const newAsset: Asset = {
    id: crypto.randomUUID(),
    type: EntityType.ASSET,
    name: "",
  };
  return newAsset;
};

export const createEmptyTransaction = (type: TransactionType) => {
  const newTransaction: Transaction = {
    id: crypto.randomUUID(),
    type: type,
    name: "",
  };
  return newTransaction;
};

export const createEmptyCategory = () => {
  const newCategory: Category = {
    id: crypto.randomUUID(),
    type: EntityType.CATEGORY,
    name: "",
    amount: 0,
  };
  return newCategory;
};

// Populate / Delete
export const deleteAllData = () => {
  localStorage.removeItem(CollectionType.TRANSACTIONS);
  localStorage.removeItem(CollectionType.ASSETS);
  localStorage.removeItem(CollectionType.CATEGORIES);
  localStorage.removeItem(CollectionType.SOURCES);
};

// Dummy data generator
const generateId = () => crypto.randomUUID();
const randomAmount = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomTransaction = (type: TransactionType) => {
  const amount = randomAmount(10, 500);
  switch (type) {
    case TransactionType.EXPENSE:
      return {
        id: generateId(),
        type: "expense",
        name: "Groceries",
        src: `asset-${randomAmount(1, 5)}`,
        srcAmount: amount,
        dst: `category-${randomAmount(1, 5)}`,
        dstAmount: amount,
        date_utc: new Date(
          Date.now() - randomAmount(0, 30) * 24 * 60 * 60 * 1000
        ).toISOString(),
      } as Expense;

    case TransactionType.TRANSFER:
      const srcId = `asset-${randomAmount(1, 5)}`;
      let dstId;
      do {
        dstId = `asset-${randomAmount(1, 5)}`;
      } while (dstId === srcId);

      return {
        id: generateId(),
        type: "transfer",
        name: "Transfer",
        src: srcId,
        srcAmount: amount,
        dst: dstId,
        dstAmount: amount,
        date_utc: new Date(
          Date.now() - randomAmount(0, 30) * 24 * 60 * 60 * 1000
        ).toISOString(),
      } as Transfer;

    case TransactionType.INCOME:
      return {
        id: generateId(),
        type: "income",
        name: "Salary",
        src: `source-${randomAmount(1, 5)}`,
        srcAmount: amount,
        dst: `asset-${randomAmount(1, 5)}`,
        dstAmount: amount,
        date_utc: new Date(
          Date.now() - randomAmount(0, 30) * 24 * 60 * 60 * 1000
        ).toISOString(),
      } as Income;
  }
};

export const generateDummyData = () => {
  const expenses = Array.from({ length: 20 }, () => {
    return generateRandomTransaction(TransactionType.EXPENSE);
  });

  const transfers = Array.from({ length: 10 }, () => {
    return generateRandomTransaction(TransactionType.TRANSFER);
  });

  const incomes = Array.from({ length: 5 }, () => {
    return generateRandomTransaction(TransactionType.INCOME);
  });

  const transactions = [...expenses, ...transfers, ...incomes];

  const categoryNames = [
    "Food & Drinks",
    "Housing",
    "Transportation",
    "Entertainment",
    "Savings",
  ];
  const categories = Array.from({ length: 5 }, (_, i) => ({
    id: `category-${i + 1}`,
    type: "category",
    name: categoryNames[i],
    currency: "USD",
    amount: randomAmount(100, 1000),
  }));

  const assetNames = [
    "Bank Account",
    "Cash",
    "Credit Card",
    "Investment Account",
    "Savings Account",
  ];
  const assets = Array.from({ length: 5 }, (_, i) => ({
    id: `asset-${i + 1}`,
    type: "asset",
    name: assetNames[i],
    currency: "USD",
  }));

  const sourceNames = [
    "Company",
    "Freelance",
    "Rental Income",
    "Gift",
    "Other",
  ];
  const sources = Array.from({ length: 5 }, (_, i) => ({
    id: `source-${i + 1}`,
    type: "source",
    name: sourceNames[i],
    currency: "USD",
  }));

  // Store data in localStorage by collection type
  const dataMap = {
    transactions,
    categories,
    assets,
    sources,
  };

  Object.entries(dataMap).forEach(([collectionType, data]) => {
    localStorage.setItem(collectionType, JSON.stringify(data));
  });

  console.log("Dummy data has been stored in localStorage.");
};
