// rrd imports
import { ActionFunction } from "react-router-dom";

// Interfaces
import { Period } from "../components/Buttons/PeriodSelector";
import {
  FilterInstanceType,
  SortInstanceType,
} from "../components/Dashboard/Transactions";
import {
  Asset,
  Category,
  CurrencyRates,
  CollectionType,
  DataItem,
  DataItemType,
  Entity,
  EntityType,
  FormInput,
  Goal,
  Transaction,
  TransactionType,
  typeToCollectionMap,
  Expense,
  Transfer,
  Income,
} from "./dataModels";

/* -------------- Data Management -------------- */

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

export const getItemById = (type: DataItemType, id: string): DataItem => {
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
    initBalance: parseFloat(values.initBalance),
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
export const createTransaction = (values: FormInput) => {
  const transactions = fetchData(CollectionType.TRANSACTIONS) ?? [];

  if (values.type === TransactionType.EXPENSE) {
    const newTransaction: Expense = {
      id: values.id ?? crypto.randomUUID(),
      type: TransactionType.EXPENSE,
      src: {
        type: EntityType.ASSET,
        id: values.src,
        amount: parseFloat(values.amount),
      },
      dst: {
        type: EntityType.CATEGORY,
        id: values.dst,
        amount: parseFloat(values.amount),
      },
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
        type: EntityType.ASSET,
        id: values.src,
        amount: parseFloat(values.amount),
      },
      dst: {
        type: EntityType.ASSET,
        id: values.dst,
        amount: parseFloat(values.amount),
      },
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
        type: EntityType.SOURCE,
        id: values.src,
        amount: parseFloat(values.amount),
      },
      dst: {
        type: EntityType.ASSET,
        id: values.dst,
        amount: parseFloat(values.amount),
      },
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

export const deleteTransaction = (transaction_id: string) => {
  return deleteItem(CollectionType.TRANSACTIONS, transaction_id);
};

// Category
export const createCategory = (values: FormInput) => {
  const newCategory: Category = {
    id: values.id ?? crypto.randomUUID(),
    type: EntityType.CATEGORY,
    name: values.name,
    totalBudgeted: parseFloat(values.totalBudgeted),
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

/* -------------- Asset and Category -------------- */

// Calculate Spent By Category
export const spentByCategory = (
  category: Category,
  currencyRates: CurrencyRates,
  period: Period
) => {
  const transactions = fetchData(CollectionType.TRANSACTIONS) as Transaction[];
  const filteredTransactions = filterTransactions(
    transactions,
    "Date",
    convertPeriodToString(period)
  );

  const total = filteredTransactions.reduce((spent: number, transaction) => {
    if (transaction.type === "expense" && transaction.dst.id === category.id) {
      const { source, destination } = getTransactionNodes(transaction);

      return (
        spent +
        convertCurrency(
          currencyRates,
          source.currency,
          destination.currency,
          transaction.dst.amount
        )
      );
    }
    return spent;
  }, 0);
  return total;
};

export const getCategorySpentHistory = (
  period: Period,
  baseCurrency: string | null,
  rates: CurrencyRates
) => {
  const transactions = sortFilterTransactions(
    fetchData(CollectionType.TRANSACTIONS),
    "Date",
    convertPeriodToString(period),
    "Date",
    "Ascending"
  ) as Transaction[];
  if (!transactions || transactions.length === 0) return undefined;

  const categories = fetchData(CollectionType.CATEGORIES) as Category[];

  const months: string[] = [];
  const startDate = new Date(transactions[0].date);
  const endDate = new Date(transactions[transactions.length - 1].date);
  for (
    let d = new Date(startDate);
    d.getFullYear() <= endDate.getFullYear() &&
    d.getMonth() <= endDate.getMonth();
    d.setMonth(d.getMonth() + 1)
  ) {
    months.push(d.toISOString().slice(0, 7));
  }

  const spentHistoryMap: { [key: string]: any } = {};
  for (let i = 0; i < months.length; i++) {
    spentHistoryMap[months[i]] = {};
    for (let j = 0; j < categories.length; j++) {
      spentHistoryMap[months[i]][categories[j].name] = 0;
    }
  }

  transactions.forEach((transaction) => {
    const month = new Date(transaction.date).toISOString().slice(0, 7);
    const category = categories.find((a) => a.id === transaction.dst.id);
    if (category) {
      spentHistoryMap[month][category.name] += +transaction.dst.amount;
    }
  });

  for (let i = 0; i < months.length; i++) {
    for (let j = 0; j < categories.length; j++) {
      const change = spentHistoryMap[months[i]][categories[j].name];
      spentHistoryMap[months[i]][categories[j].name] = baseCurrency
        ? +convertCurrency(
            rates,
            categories[j].currency,
            baseCurrency,
            change
          ).toFixed(2)
        : change;
    }
  }

  const spentHistory = Object.entries(spentHistoryMap).map(
    ([month, categorySpent]) => {
      return {
        ["month"]: month,
        ...categorySpent,
      };
    }
  );

  return spentHistory;
};

// Calculate Balance of Asset
export const getBalanceOfAsset = (asset: Asset) => {
  const transactions = fetchData(CollectionType.TRANSACTIONS) as Transaction[];
  let balance = +asset.initBalance;
  const now = new Date();

  transactions.forEach((transaction) => {
    if (
      new Date(transaction.date) < new Date(now) &&
      transaction.src.id === asset.id
    ) {
      balance -= transaction.src.amount;
    } else if (
      new Date(transaction.date) < new Date(now) &&
      transaction.dst.id === asset.id
    ) {
      balance += Number(transaction.dst.amount);
    }
  });

  return balance;
};

export const getAssetDetails = (asset: Asset, period: Period) => {
  const transactions = filterTransactions(
    fetchData(CollectionType.TRANSACTIONS),
    "Date",
    convertPeriodToString(period)
  );
  const data = {
    income: 0,
    expense: 0,
    transfer: 0,
  };

  transactions.forEach((transaction) => {
    if (transaction.src.id === asset.id)
      data[transaction.type] -= transaction.src.amount;
    else if (transaction.dst.id === asset.id)
      data[transaction.type] += transaction.dst.amount;
  });

  return data;
};

interface balanceHistoryItem {
  month: string; // (e.g., '2024-06')
  [key: string]: string | number; // key = id, value = amount
}

export const getAssetBalanceHistory = (
  period: Period,
  baseCurrency: string | null,
  rates: CurrencyRates
) => {
  const transactions = sortFilterTransactions(
    fetchData(CollectionType.TRANSACTIONS),
    "Date",
    convertPeriodToString(period),
    "Date",
    "Ascending"
  ) as Transaction[];
  if (!transactions || transactions.length === 0) return undefined;
  const assets = fetchData(CollectionType.ASSETS) as Asset[];

  const months: string[] = [];
  const startDate = new Date(transactions[0].date);
  const endDate = new Date(transactions[transactions.length - 1].date);
  for (
    let d = new Date(startDate);
    d.getFullYear() <= endDate.getFullYear() &&
    d.getMonth() <= endDate.getMonth();
    d.setMonth(d.getMonth() + 1)
  ) {
    months.push(d.toISOString().slice(0, 7));
  }

  const balanceHistoryMap: { [key: string]: any } = {};
  for (let i = 0; i < months.length; i++) {
    balanceHistoryMap[months[i]] = {};
    for (let j = 0; j < assets.length; j++) {
      balanceHistoryMap[months[i]][assets[j].name] = 0;
    }
  }

  transactions.forEach((transaction) => {
    const month = new Date(transaction.date).toISOString().slice(0, 7);
    const { source, destination } = getTransactionNodes(transaction);
    switch (transaction.type) {
      case "income":
        balanceHistoryMap[month][destination.name] += transaction.dst.amount;
        break;
      case "expense":
        balanceHistoryMap[month][source.name] -= transaction.src.amount;
        break;
      case "transfer":
        balanceHistoryMap[month][source.name] -= transaction.src.amount;
        balanceHistoryMap[month][destination.name] += transaction.dst.amount;
        break;
    }
  });

  const curBalances = [];
  for (let i = 0; i < assets.length; i++) {
    curBalances.push(assets[i].initBalance);
  }

  for (let i = 0; i < months.length; i++) {
    for (let j = 0; j < assets.length; j++) {
      const change = balanceHistoryMap[months[i]][assets[j].name];
      curBalances[j] = Number(curBalances[j]) + Number(change);
      balanceHistoryMap[months[i]][assets[j].name] = baseCurrency
        ? convertCurrency(
            rates,
            assets[j].currency,
            baseCurrency,
            curBalances[j]
          )
        : curBalances[j];
    }
  }

  const balanceHistory: balanceHistoryItem[] = Object.entries(
    balanceHistoryMap
  ).map(([month, assetBalances]) => {
    return {
      ["month"]: month,
      ...assetBalances,
    };
  });

  return balanceHistory;
};

const adjustDate = (date: Date, unit: string, adjustment: number) => {
  if (unit === "day") {
    date.setDate(date.getDate() + adjustment);
  } else if (unit === "week") {
    date.setDate(date.getDate() + adjustment * 7);
  } else if (unit === "month") {
    date.setMonth(date.getMonth() + adjustment);
  } else if (unit === "year") {
    date.setFullYear(date.getFullYear() + adjustment);
  }
};

const convertPeriodToString = (period: Period): string[] => {
  if (period.type === "absolute") return [period.start, period.end];

  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();
  if (period.option === "Past") {
    adjustDate(startDate, period.unit, -Number(period.value ?? 1));
  } else if (period.option === "Next") {
    adjustDate(startDate, period.unit, Number(period.value ?? 1));
  } else if (period.unit === "Year") {
    startDate.setMonth(0, 1);
    endDate.setMonth(11, 31);
  } else if (period.unit === "Month") {
    startDate.setDate(1);
    endDate.setMonth(now.getMonth() + 1);
    endDate.setDate(0);
  } else if (period.unit === "Week") {
    const dayOfWeek = now.getDay();
    startDate.setDate(now.getDate() - dayOfWeek + 1);
    endDate.setDate(now.getDate() + (7 - dayOfWeek));
  }

  return [formatDateToInputValue(startDate), formatDateToInputValue(endDate)];
};

/* -------------- Transactions -------------- */

export const getTransactionNodes = (
  transaction: Transaction
): { source: Entity; destination: Entity } => {
  return {
    source: getItemById(transaction.src.type, transaction.src.id) as Entity,
    destination: getItemById(
      transaction.dst.type,
      transaction.dst.id
    ) as Entity,
  };
};

// Sort-Filter Transactions

const filterTransactions = (
  transactions: Transaction[],
  filterOption: string,
  filterValue: string[]
) => {
  if (filterValue.length === 1 && filterValue[0] === "") return transactions;
  if (filterOption === "None") return transactions;

  let filterFunction: (transaction: Transaction) => boolean;

  switch (filterOption) {
    case "Name":
      filterFunction = (transaction) =>
        transaction.name.toLowerCase().includes(filterValue[0].toLowerCase());
      break;

    // case "Asset":
    //   filterFunction = (transaction) => {
    //     return (
    //       transaction.src.id === filterValue[0] ||
    //       transaction.dst.id === filterValue[0]
    //     );
    //   };
    //   break;

    // case "Category":
    //   filterFunction = (transaction) => {
    //     return transaction.dst.id === filterValue[0];
    //   };
    //   break;

    case "Type":
      filterFunction = (transaction) => {
        return transaction.type === filterValue[0];
      };
      break;

    case "Date":
      if (filterValue[0] === "allTime") {
        filterFunction = () => true;
        break;
      }

      let startDate = new Date(filterValue[0]);
      let endDate = new Date(filterValue[1]);

      filterFunction = (transaction) => {
        return (
          new Date(transaction.date) >= startDate &&
          new Date(transaction.date) <= endDate
        );
      };
      break;

    // case "Amount":
    //   filterFunction = (transaction) => {
    //     const minAmount = filterValue[0] === "" ? 0 : Number(filterValue[0]);
    //     const maxAmount =
    //       filterValue[1] === "" ? Infinity : Number(filterValue[1]);
    //     return (
    //       transaction.amount >= minAmount && transaction.amount <= maxAmount
    //     );
    //   };
    //   break;

    default:
      filterFunction = () => true;
      break;
  }

  return transactions.filter(filterFunction);
};

const getFilterFunction = (option: string[], value: string | null) => {
  let filterFunction: (a: Transaction) => boolean;

  if (!value) {
    return () => true;
  }

  switch (option[0]) {
    case "Name":
      filterFunction = (a: Transaction) => {
        if (option[1] === "Contains") return a.name.includes(value);
        if (option[1] === "Is") return a.name === value;
        if (option[1] === "Starts With") return a.name.startsWith(value);
        return true;
      };
      break;

    // case "Asset":
    //   filterFunction = (a: Transaction) => {
    //     if (option[1] === "Is") return a.asset_id === value;
    //     if (option[1] === "Is not") return a.asset_id !== value;
    //     return true;
    //   };
    //   break;

    // case "Category":
    //   filterFunction = (a: Transaction) => {
    //     if (option[1] === "Is") return a.category_id === value;
    //     if (option[1] === "Is not") return a.category_id !== value;
    //     return true;
    //   };
    //   break;

    case "Date":
      filterFunction = (a: Transaction) => {
        const filterDate = new Date(value);
        const transactionDate = new Date(a.date);
        if (option[1] === "Is")
          return transactionDate.getTime() === filterDate.getTime();
        if (option[1] === "Is before") return transactionDate < filterDate;
        if (option[1] === "Is after") return transactionDate > filterDate;
        return true;
      };
      break;

    // case "Amount":
    //   filterFunction = (a: Transaction) => {
    //     const filterAmount = parseFloat(value);
    //     const transactionAmount = Number(a.amount);
    //     if (isNaN(filterAmount)) return true;
    //     if (option[1] === "Equal") return transactionAmount === filterAmount;
    //     if (option[1] === "More") return transactionAmount > filterAmount;
    //     if (option[1] === "Less") return transactionAmount < filterAmount;
    //     if (option[1] === "At Least") return transactionAmount >= filterAmount;
    //     if (option[1] === "At Most") return transactionAmount <= filterAmount;
    //     return true;
    //   };
    //   break;

    case "Type":
      filterFunction = (a: Transaction) => {
        if (option[1] === "Is") return a.type === value;
        if (option[1] === "Is not") return a.type !== value;
        return true;
      };
      break;

    default:
      filterFunction = () => true;
  }

  return filterFunction;
};

export const filterTransactions2 = (
  transactions: Transaction[],
  filterOrder: FilterInstanceType[]
) => {
  return filterOrder.reduce((data, curFilter) => {
    const filterFunc = getFilterFunction(curFilter.option, curFilter.value);
    return data.filter(filterFunc);
  }, transactions);
};

const getSortFunction = (option: string, isAscending: boolean = true) => {
  let sortFunction: (a: Transaction, b: Transaction) => number;
  const directionMultiplier = isAscending ? 1 : -1;
  switch (option) {
    case "Last Edited":
      sortFunction = (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      break;
    case "Name":
      sortFunction = (a, b) => a.name.localeCompare(b.name);
      break;
    // case "Asset":
    //   sortFunction = (a, b) => {
    //     const assetA = getItemById(EntityType.ASSET, a.asset_id)?.name ?? "";
    //     const assetB = getItemById(EntityType.ASSET, b.asset_id)?.name ?? "";
    //     return assetA.localeCompare(assetB);
    //   };
    //   break;
    // case "Category":
    //   sortFunction = (a, b) => {
    //     const categoryA = getItemById(EntityType.CATEGORY, a.category_id)?.name ?? "";
    //     const categoryB = getItemById(EntityType.CATEGORY, b.category_id)?.name ?? "";
    //     return categoryA.localeCompare(categoryB);
    //   };
    //   break;
    case "Date":
      sortFunction = (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime();
      break;
    // case "Amount":
    //   sortFunction = (a, b) => a.amount - b.amount;
    //   break;
    case "Type":
      sortFunction = (a, b) => a.type.localeCompare(b.type);
      break;
    default:
      sortFunction = () => 0;
      break;
  }
  return (a: Transaction, b: Transaction) =>
    sortFunction(a, b) * directionMultiplier;
};

export const sortTransactions2 = (
  transactions: Transaction[],
  sortOrder: SortInstanceType[]
) => {
  return sortOrder.reduce((data, curSort) => {
    const sortFunc = getSortFunction(curSort.option, curSort.isAscending);
    return data.sort(sortFunc);
  }, transactions);
};

const sortTransactions = (
  transactions: Transaction[],
  sortOption: string,
  sortValue: string
) => {
  if (sortValue === "") return transactions;

  const sortFunction = getSortFunction(sortOption, sortValue === "Ascending");

  return transactions.sort((a, b) => sortFunction(a, b));
};

export const sortFilterTransactions2 = (
  transactions: Transaction[],
  filterOrder: FilterInstanceType[],
  sortOrder: SortInstanceType[]
): Transaction[] => {
  return sortTransactions2(
    filterTransactions2(transactions, filterOrder),
    sortOrder
  );
};

export const sortFilterTransactions = (
  transactions: Transaction[],
  filterOption: string,
  filterValue: string[],
  sortOption: string,
  sortValue: string
) => {
  return sortTransactions(
    filterTransactions(transactions, filterOption, filterValue),
    sortOption,
    sortValue
  );
};

/* -------------- Currency -------------- */

interface CachedRates {
  rates: CurrencyRates;
  timestamp: number;
}

// Get Currency Rates
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEY = "currencyRatesCache";

export const getCurrencyRates = async (baseCurrency: string = "USD") => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const parsedData: CachedRates = JSON.parse(cachedData);
    const currentTime = Date.now();

    if (currentTime - parsedData.timestamp < CACHE_DURATION) {
      return parsedData.rates;
    }
  }

  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/3ff658fcac35df0f62ba4089/latest/${baseCurrency}`
  );
  const data = await response.json();

  if (data.result !== "success") {
    throw new Error("Failed to get currencies");
  }

  const newCache: CachedRates = {
    rates: data.conversion_rates,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));

  return newCache.rates;
};

// List of currencies
export const getAllCurrencies = () => [
  "USD",
  "AED",
  "AFN",
  "ALL",
  "AMD",
  "ANG",
  "AOA",
  "ARS",
  "AUD",
  "AWG",
  "AZN",
  "BAM",
  "BBD",
  "BDT",
  "BGN",
  "BHD",
  "BIF",
  "BMD",
  "BND",
  "BOB",
  "BRL",
  "BSD",
  "BTN",
  "BWP",
  "BYN",
  "BZD",
  "CAD",
  "CDF",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CRC",
  "CUP",
  "CVE",
  "CZK",
  "DJF",
  "DKK",
  "DOP",
  "DZD",
  "EGP",
  "ERN",
  "ETB",
  "EUR",
  "FJD",
  "FKP",
  "FOK",
  "GBP",
  "GEL",
  "GGP",
  "GHS",
  "GIP",
  "GMD",
  "GNF",
  "GTQ",
  "GYD",
  "HKD",
  "HNL",
  "HRK",
  "HTG",
  "HUF",
  "IDR",
  "ILS",
  "IMP",
  "INR",
  "IQD",
  "IRR",
  "ISK",
  "JEP",
  "JMD",
  "JOD",
  "JPY",
  "KES",
  "KGS",
  "KHR",
  "KID",
  "KMF",
  "KRW",
  "KWD",
  "KYD",
  "KZT",
  "LAK",
  "LBP",
  "LKR",
  "LRD",
  "LSL",
  "LYD",
  "MAD",
  "MDL",
  "MGA",
  "MKD",
  "MMK",
  "MNT",
  "MOP",
  "MRU",
  "MUR",
  "MVR",
  "MWK",
  "MXN",
  "MYR",
  "MZN",
  "NAD",
  "NGN",
  "NIO",
  "NOK",
  "NPR",
  "NZD",
  "OMR",
  "PAB",
  "PEN",
  "PGK",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "QAR",
  "RON",
  "RSD",
  "RUB",
  "RWF",
  "SAR",
  "SBD",
  "SCR",
  "SDG",
  "SEK",
  "SGD",
  "SHP",
  "SLE",
  "SLL",
  "SOS",
  "SRD",
  "SSP",
  "STN",
  "SYP",
  "SZL",
  "THB",
  "TJS",
  "TMT",
  "TND",
  "TOP",
  "TRY",
  "TTD",
  "TVD",
  "TWD",
  "TZS",
  "UAH",
  "UGX",
  "UYU",
  "UZS",
  "VES",
  "VND",
  "VUV",
  "WST",
  "XAF",
  "XCD",
  "XDR",
  "XOF",
  "XPF",
  "YER",
  "ZAR",
  "ZMW",
  "ZWL",
];

// Convert Currency
export const convertCurrency = (
  rates: CurrencyRates,
  currencyFrom: string,
  currencyTo: string,
  amount: number
) => {
  return (
    (Number(rates[currencyTo]) * Number(amount)) / Number(rates[currencyFrom])
  );
};

/* -------------- Formatting -------------- */

// Format Date
export const formatDate = (date: Date): string => {
  const day = new Date(date).getDate();
  const month = new Date(date).toLocaleString("default", { month: "long" });
  const year = new Date(date).getFullYear();

  return `${month} ${day}, ${year}`;
};

export const formatDateMonthStr = (monthYear: string): string => {
  const date = new Date(monthYear + "-01");
  const month = new Date(date).toLocaleString("default", { month: "long" });
  const year = new Date(date).getFullYear();

  return `${month} ${year}`;
};

export const formatDateToInputValue = (date: Date): string => {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();

  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const monthStr = month < 10 ? `0${month}` : `${month}`;

  return `${year}-${monthStr}-${dayStr}`;
};

// Format Currency
export const formatCurrency = (amount: number, currency: string) => {
  const amountStr = +(+amount).toFixed(2);
  return amountStr + " " + currency;
};
