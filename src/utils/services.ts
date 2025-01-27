// Interfaces
import {
  Asset,
  Category,
  CollectionType,
  DataItem,
  EntityType,
  Transaction,
  TransactionType,
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
    src: { id: "" },
    dst: { id: "" },
    createdAt: new Date(),
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

export const generateDummyData = () => {
  const expenses = Array.from({ length: 20 }, () => {
    const amount = randomAmount(10, 500);
    return {
      id: generateId(),
      type: "expense",
      name: "Groceries",
      src: { id: `asset-${randomAmount(1, 5)}` },
      srcAmount: amount,
      dst: { id: `category-${randomAmount(1, 5)}` },
      dstAmount: amount,
      date: new Date(Date.now() - randomAmount(0, 30) * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };
  });

  const transfers = Array.from({ length: 10 }, () => {
    const srcId = `asset-${randomAmount(1, 5)}`;
    let dstId;
    do {
      dstId = `asset-${randomAmount(1, 5)}`;
    } while (dstId === srcId);
    const amount = randomAmount(10, 500);

    return {
      id: generateId(),
      type: "transfer",
      name: "Transfer",
      src: { id: srcId },
      srcAmount: amount,
      dst: { id: dstId },
      dstAmount: amount,
      date: new Date(Date.now() - randomAmount(0, 30) * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };
  });

  const incomes = Array.from({ length: 5 }, () => {
    const amount = randomAmount(10, 500);
    return {
      id: generateId(),
      type: "income",
      name: "Salary",
      src: { id: `source-${randomAmount(1, 5)}` },
      srcAmount: amount,
      dst: { id: `asset-${randomAmount(1, 5)}` },
      dstAmount: amount,
      date: new Date(Date.now() - randomAmount(0, 30) * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };
  });

  const transactions = [...expenses, ...transfers, ...incomes];

  const categories = Array.from({ length: 5 }, (_, i) => ({
    id: `category-${i + 1}`,
    type: "category",
    name: [
      "Food & Drinks",
      "Housing",
      "Transportation",
      "Entertainment",
      "Savings",
    ][i],
    currency: "USD",
    amount: randomAmount(100, 1000),
  }));

  const assets = Array.from({ length: 5 }, (_, i) => ({
    id: `asset-${i + 1}`,
    type: "asset",
    name: [
      "Bank Account",
      "Cash",
      "Credit Card",
      "Investment Account",
      "Savings Account",
    ][i],
    currency: "USD",
  }));

  const sources = Array.from({ length: 5 }, (_, i) => ({
    id: `source-${i + 1}`,
    type: "source",
    name: ["Company", "Freelance", "Rental Income", "Gift", "Other"][i],
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
