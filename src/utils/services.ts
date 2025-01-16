// rrd imports
import { ActionFunction } from "react-router-dom";

// Interfaces
import {
  Asset,
  Category,
  CollectionType,
  DataItem,
  DataItemType,
  EntityType,
  FormInput,
  Transaction,
  TransactionType,
  typeToCollectionMap,
} from "./types";

export const actionHandler: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "createAsset") {
    try {
      createAsset(values as FormInput);
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Asset is not created!");
    }
  }

  if (_action === "editAsset") {
    try {
      editAsset(values.asset_id as string, values as FormInput);
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Transaction is not updated!");
    }
  }

  if (_action === "deleteAsset") {
    try {
      deleteAsset(values.asset_id as string);
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Asset is not deleted!");
    }
  }

  if (_action === "createCategory") {
    try {
      createCategory(values as FormInput);
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Category is not created!");
    }
  }

  if (_action === "editCategory") {
    try {
      editCategory(values.category_id as string, values as FormInput);
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Category is not updated!");
    }
  }

  if (_action === "deleteCategory") {
    try {
      deleteCategory(values.category_id as string);
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Category is not deleted!");
    }
  }

  return null;
};

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

/**
 * @deprecated
 */
export const getItemById = (
  type: DataItemType,
  id: string
): Partial<DataItem> => {
  if (!id) {
    return {};
  }
  const collectionType = typeToCollectionMap[type];
  const collection = fetchData(collectionType);
  return collection.filter((d: DataItem) => d.id === id)[0];
};

// Asset
export const createAsset = (values: FormInput) => {
  const newAsset: Asset = {
    id: values.id ?? crypto.randomUUID(),
    type: EntityType.ASSET,
    name: values.name,
    currency: values.currency,
  };
  const assets = fetchData(CollectionType.ASSETS) ?? [];
  return localStorage.setItem(
    CollectionType.ASSETS,
    JSON.stringify([...assets, newAsset])
  );
};

export const editAsset = (asset_id: string, values: FormInput) => {
  const assets: Asset[] = fetchData(CollectionType.ASSETS) ?? [];
  assets.forEach((asset) => {
    if (asset.id === asset_id) {
      asset.name = values.name;
      asset.currency = values.currency;
    }
  });
  return localStorage.setItem(CollectionType.ASSETS, JSON.stringify(assets));
};

export const deleteAsset = (asset_id: string) => {
  const transactions = fetchData(CollectionType.TRANSACTIONS) as Transaction[];
  const filteredTransactions = transactions.filter((d) => {
    return d.src?.id !== asset_id && d.dst?.id !== asset_id;
  });

  localStorage.setItem(
    CollectionType.TRANSACTIONS,
    JSON.stringify(filteredTransactions)
  );
  return deleteItem(CollectionType.ASSETS, asset_id);
};

// Transaction
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

// Category
export const createCategory = (values: FormInput) => {
  const newCategory: Category = {
    id: values.id ?? crypto.randomUUID(),
    type: EntityType.CATEGORY,
    name: values.name,
    amount: parseFloat(values.amount),
    currency: values.currency,
  };

  const categories = fetchData(CollectionType.CATEGORIES) ?? [];

  return localStorage.setItem(
    CollectionType.CATEGORIES,
    JSON.stringify([...categories, newCategory])
  );
};

export const editCategory = (category_id: string, values: FormInput) => {
  const categories: Category[] = fetchData(CollectionType.CATEGORIES) ?? [];
  categories.forEach((category) => {
    if (category.id === category_id) {
      category.name = values.name;
      category.currency = values.currency;
      category.amount = parseFloat(values.amount);
    }
  });
  return localStorage.setItem(
    CollectionType.CATEGORIES,
    JSON.stringify(categories)
  );
};

export const deleteCategory = (category_id: string) => {
  const transactions = fetchData(CollectionType.TRANSACTIONS) as Transaction[];
  const filteredTransactions = transactions.filter(
    (d) => d.type === "expense" && d.dst?.id !== category_id
  );

  localStorage.setItem(
    CollectionType.TRANSACTIONS,
    JSON.stringify(filteredTransactions)
  );
  return deleteItem(CollectionType.CATEGORIES, category_id);
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
