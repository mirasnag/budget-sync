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
  Goal,
  Transaction,
  TransactionType,
  typeToCollectionMap,
  Expense,
  Transfer,
  Income,
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
      throw new Error("Transaction is not deleted!");
    }
  }

  if (_action === "createTransaction") {
    try {
      createTransaction(values as FormInput);
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Transaction is not created!");
    }
  }

  if (_action === "editTransaction") {
    try {
      editTransaction(values.transaction_id as string, values as FormInput);
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Transaction is not updated!");
    }
  }

  if (_action === "deleteTransaction") {
    try {
      deleteTransaction(values.transaction_id as string);
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Transaction is not deleted!");
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

  // if (_action === "createGoal") {
  //   try {
  //     createGoal(values as FormInput);
  //     return null;
  //   } catch (e) {
  //     console.log(e);
  //     throw new Error("Goal is not created!");
  //   }
  // }

  // if (_action === "editGoal") {
  //   console.log(values);
  //   try {
  //     editGoal(values.goal_id as string, values as FormInput);
  //     return null;
  //   } catch (e) {
  //     console.log(e);
  //     throw new Error("Goal is not updated!");
  //   }
  // }

  // if (_action === "deleteGoal") {
  //   try {
  //     deleteGoal(values.goal_id as string);
  //     return null;
  //   } catch (e) {
  //     console.log(e);
  //     throw new Error("Goal is not deleted!");
  //   }
  // }

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

export const createItem = (newItem: Partial<DataItem>) => {
  if (!newItem.type) return;

  const collectionType = typeToCollectionMap[newItem.type];
  const collection = fetchData(collectionType) as DataItem[];
  return localStorage.setItem(
    collectionType,
    JSON.stringify([...collection, newItem])
  );
};

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
    amount: parseFloat(values.amount),
    currency: values.currency,
  };
  const assets = fetchData(CollectionType.ASSETS) ?? [];
  return localStorage.setItem(
    CollectionType.ASSETS,
    JSON.stringify([...assets, newAsset])
  );
};

export const editAsset = (asset_id: string, values: FormInput) => {
  deleteItem(CollectionType.ASSETS, asset_id);
  values.id = asset_id;
  createAsset(values);
};

export const deleteAsset = (asset_id: string) => {
  const transactions = fetchData(CollectionType.TRANSACTIONS) as Transaction[];
  const filteredTransactions = transactions.filter((d) => {
    d.src.id !== asset_id && d.dst.id !== asset_id;
  });

  localStorage.setItem(
    CollectionType.TRANSACTIONS,
    JSON.stringify(filteredTransactions)
  );
  return deleteItem(CollectionType.ASSETS, asset_id);
};

// Transaction
export const createEmptyTransaction = (type: TransactionType) => {
  const transactions = fetchData(CollectionType.TRANSACTIONS) ?? [];

  const newTransaction: Partial<Transaction> = {
    id: crypto.randomUUID(),
    type: type,
    createdAt: new Date(),
  };
  localStorage.setItem(
    CollectionType.TRANSACTIONS,
    JSON.stringify([...transactions, newTransaction])
  );
  return;
};

export const createTransaction = (values: FormInput) => {
  const transactions = fetchData(CollectionType.TRANSACTIONS) ?? [];

  if (values.type === TransactionType.EXPENSE) {
    const newTransaction: Expense = {
      id: values.id ?? crypto.randomUUID(),
      type: TransactionType.EXPENSE,
      src: {
        id: values.src,
      },
      srcAmount: parseFloat(values.amount),
      dst: {
        id: values.dst,
      },
      dstAmount: parseFloat(values.amount),
      name: values.name,
      date: new Date(values.date),
      createdAt: new Date(),
    };

    return localStorage.setItem(
      CollectionType.TRANSACTIONS,
      JSON.stringify([...transactions, newTransaction])
    );
  }

  if (values.type === TransactionType.TRANSFER) {
    const newTransaction: Transfer = {
      id: values.id ?? crypto.randomUUID(),
      type: TransactionType.TRANSFER,
      src: {
        id: values.src,
      },
      srcAmount: parseFloat(values.amount),
      dst: {
        id: values.dst,
      },
      dstAmount: parseFloat(values.amount),
      name: values.name,
      date: new Date(values.date),
      createdAt: new Date(),
    };

    return localStorage.setItem(
      CollectionType.TRANSACTIONS,
      JSON.stringify([...transactions, newTransaction])
    );
  }

  if (values.type === TransactionType.INCOME) {
    const newTransaction: Income = {
      id: values.id ?? crypto.randomUUID(),
      type: TransactionType.INCOME,
      src: {
        id: values.src,
      },
      srcAmount: parseFloat(values.amount),
      dst: {
        id: values.dst,
      },
      dstAmount: parseFloat(values.amount),
      name: values.name,
      date: new Date(values.date),
      createdAt: new Date(),
    };

    return localStorage.setItem(
      CollectionType.TRANSACTIONS,
      JSON.stringify([...transactions, newTransaction])
    );
  }
};

export const editTransaction = (transaction_id: string, values: FormInput) => {
  deleteItem(CollectionType.TRANSACTIONS, transaction_id);
  values.id = transaction_id;
  createTransaction(values);
};

export const editTransactionProp = <K extends keyof Transaction>(
  transaction_id: string,
  prop: K,
  value: Transaction[K]
) => {
  const transactions = (fetchData(CollectionType.TRANSACTIONS) ??
    []) as Transaction[];

  const newTransactions: Transaction[] = transactions.map(
    (transaction: Transaction) => {
      if (transaction.id !== transaction_id) return transaction;
      return {
        ...transaction,
        [prop]: value,
      };
    }
  );

  localStorage.setItem(
    CollectionType.TRANSACTIONS,
    JSON.stringify([...newTransactions])
  );
};

export const deleteTransaction = (transaction_id: string) => {
  return deleteItem(CollectionType.TRANSACTIONS, transaction_id);
};

export const getTransaction = (transaction_id: string): Transaction => {
  return getItemById("transaction", transaction_id) as Transaction;
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
  deleteItem(CollectionType.CATEGORIES, category_id);
  values.id = category_id;
  createCategory(values);
};

export const deleteCategory = (category_id: string) => {
  const transactions = fetchData(CollectionType.TRANSACTIONS) as Transaction[];
  const filteredTransactions = transactions.filter(
    (d) => d.type === "expense" && d.dst.id !== category_id
  );

  localStorage.setItem(
    CollectionType.TRANSACTIONS,
    JSON.stringify(filteredTransactions)
  );
  return deleteItem(CollectionType.CATEGORIES, category_id);
};

// Goal
export const createGoal = (values: FormInput) => {
  const newGoal: Goal = {
    id: values.id ?? crypto.randomUUID(),
    type: EntityType.GOAL,
    name: values.name,
    amount: parseFloat(values.amount),
    currency: values.currency,
  };

  const goals = fetchData(CollectionType.GOALS) ?? [];

  return localStorage.setItem(
    CollectionType.GOALS,
    JSON.stringify([...goals, newGoal])
  );
};

export const editGoal = (goal_id: string, values: FormInput) => {
  deleteItem(CollectionType.GOALS, goal_id);
  values.id = goal_id;
  createGoal(values);
};

export const deleteGoal = (goal_id: string) => {
  const goals = fetchData(CollectionType.GOALS) as Goal[];
  const filteredGoals = goals.filter((d) => d.id !== goal_id);

  localStorage.setItem(CollectionType.GOALS, JSON.stringify(filteredGoals));
  return deleteItem(CollectionType.GOALS, goal_id);
};

// Delete User Data
export const deleteUserData = () => {
  localStorage.removeItem(CollectionType.TRANSACTIONS);
  localStorage.removeItem(CollectionType.ASSETS);
  localStorage.removeItem(CollectionType.CATEGORIES);
};
