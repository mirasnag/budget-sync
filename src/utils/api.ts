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
  User,
  typeToCollectionMap,
} from "./types";

type ErrorHandling = { error: string };
type BackendJson = DataItem & { _id: string };

export const getErrorMessage = (json: unknown) => {
  if (json instanceof Error) {
    return json.message;
  }

  return (json as ErrorHandling).error ?? "Unknown Error";
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? (JSON.parse(user) as User) : null;
};

export const convertBackendJSON = (json: BackendJson) => {
  return { ...json, id: json._id };
};

export const fetchData = async (collection: CollectionType) => {
  const user = getUser();

  if (!user) {
    console.error("Request is not authenticated, please login");
    return;
  }

  const response = await fetch(`/api/${collection}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data)) {
    throw new Error("Invalid response format: expected an array");
  }

  return data.map((d: BackendJson) => convertBackendJSON(d));
};

export const createItem = async (newItem: Partial<DataItem>) => {
  const user = getUser();

  if (!user) {
    throw new Error("Request is not authenticated, please login");
  }

  if (!newItem.type) {
    throw new Error("Type of new item must be defined");
  }

  const collection = typeToCollectionMap[newItem.type];
  const convertedItem = JSON.stringify(newItem);

  const response = await fetch(`/api/${collection}`, {
    method: "POST",
    body: convertedItem,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  });

  if (!response.ok) {
    const json = (await response.json()) as unknown;
    throw new Error(
      `There was an error creating new ${newItem.type}: ${getErrorMessage(
        json
      )}`
    );
  }

  const json = (await response.json()) as BackendJson;
  return convertBackendJSON(json);
};

export const createEmptyAsset = async () => {
  const newAsset: Partial<Asset> = {
    type: EntityType.ASSET,
    name: "",
  };
  return (await createItem(newAsset)) as Asset;
};

export const createEmptyTransaction = async (type: TransactionType) => {
  const newTransaction: Partial<Transaction> = {
    type: type,
    name: "",
  };
  return (await createItem(newTransaction)) as Transaction;
};

export const createEmptyCategory = async () => {
  const newCategory: Partial<Category> = {
    type: EntityType.CATEGORY,
    name: "",
    amount: 0,
  };
  return (await createItem(newCategory)) as Category;
};

export const deleteItem = async (collection: CollectionType, id: string) => {
  const user = getUser();

  if (!user) {
    throw new Error("Request is not authenticated, please login");
  }

  const response = await fetch(`/api/${collection}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${user.token}` },
  });

  if (!response.ok) {
    const json = (await response.json()) as unknown;
    throw new Error(
      `There was an error deleting item in collection ${collection} with id ${id}: ${getErrorMessage(
        json
      )}`
    );
  }
};

export const editItem = async <T extends DataItem>(
  collection: CollectionType,
  id: string,
  prop: keyof T,
  value: T[keyof T]
) => {
  console.log("!");
  const user = getUser();

  if (!user) {
    throw new Error("Request is not authenticated, please login");
  }
  const body = JSON.stringify({ [prop]: value });

  const response = await fetch(`/api/${collection}/${id}`, {
    method: "PATCH",
    body: body,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  });

  if (!response.ok) {
    const json = (await response.json()) as unknown;
    throw new Error(
      `There was an error editing item in collection ${collection} with id ${id}: ${getErrorMessage(
        json
      )}`
    );
  }

  const json = (await response.json()) as BackendJson;
  return convertBackendJSON(json);
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
