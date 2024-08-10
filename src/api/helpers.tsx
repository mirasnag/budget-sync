// Interfaces
import { Asset } from "../components/Assets";
import { Category } from "../components/Categories";
import { Transaction } from "../components/Transactions";
export interface DataItem {
  [key: string]: any;
}

// Local storage
export const fetchData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Create Asset
export const createAsset = (values: Asset) => {
  const newAsset = {
    id: values.id === "" ? crypto.randomUUID() : values.id,
    name: values.name,
    initBalance: values.initBalance,
    currency: values.currency,
  };
  const assets = fetchData("assets") ?? [];
  return localStorage.setItem("assets", JSON.stringify([...assets, newAsset]));
};

// Edit Asset
export const editAsset = (asset_id: string, values: Asset) => {
  const transactions = fetchData("transactions") as Transaction[];

  deleteItem("assets", "id", asset_id as string);
  createAsset({
    id: asset_id as string,
    name: values.name as string,
    initBalance: values.initBalance as unknown as number,
    currency: values.currency as string,
  });

  const newTransactions = transactions.map((transaction) => {
    if (transaction.asset_id === asset_id)
      transaction.currency = values.currency;
    return transaction;
  });

  localStorage.setItem("transactions", JSON.stringify(newTransactions));
};

// Delete Asset
export const deleteAsset = (asset_id: string) => {
  const transactions = fetchData("transactions") as Transaction[];
  const filteredTransactions = transactions.filter(
    (d) => d.asset_id !== asset_id
  );

  localStorage.setItem("transactions", JSON.stringify(filteredTransactions));
  return deleteItem("assets", "id", asset_id);
};

// Create Transaction
export const createTransaction = (values: Transaction) => {
  const newTransaction = {
    id: values.id === "" ? crypto.randomUUID() : values.id,
    name: values.name,
    asset_id: values.asset_id,
    category_id: values.category_id,
    amount: values.amount,
    currency:
      values.currency ??
      getAllMatchingItems("assets", "id", values.asset_id)[0].currency,
    date: values.date,
    createdAt: values.createdAt,
    type: values.type,
  };

  const transactions = fetchData("transactions") ?? [];

  return localStorage.setItem(
    "transactions",
    JSON.stringify([...transactions, newTransaction])
  );
};

// Create Category
export const createCategory = (values: Category) => {
  const newCategory = {
    id: values.id === "" ? crypto.randomUUID() : values.id,
    name: values.name,
    totalBudgeted: values.totalBudgeted,
    currency: values.currency,
  };

  const categories = fetchData("categories") ?? [];

  return localStorage.setItem(
    "categories",
    JSON.stringify([...categories, newCategory])
  );
};

// Edit Category
export const editCategory = (category_id: string, values: Category) => {
  deleteItem("categories", "id", category_id as string);
  createCategory({
    id: category_id as string,
    name: values.name as string,
    totalBudgeted: values.totalBudgeted as unknown as number,
    currency: values.currency as string,
  });
};

// Delete Category
export const deleteCategory = (category_id: string) => {
  const transactions = fetchData("transactions") as Transaction[];
  const filteredTransactions = transactions.filter(
    (d) => d.category_id !== category_id
  );

  localStorage.setItem("transactions", JSON.stringify(filteredTransactions));
  return deleteItem("categories", "id", category_id);
};

// Delete User Data
export const deleteUserData = () => {
  localStorage.removeItem("transactions");
  localStorage.removeItem("assets");
  localStorage.removeItem("categories");
};

// Delete Data Item
export const deleteItem = (table: string, key: string, value: string) => {
  const data = fetchData(table) as DataItem[];
  const newData = data.filter((d) => d[key] !== value);
  return localStorage.setItem(table, JSON.stringify(newData));
};

// Calculate Spent By Category
export const spentByCategory = (
  category: Category,
  currencyRates: DataItem
  // baseCurrency: string
) => {
  const transactions = fetchData("transactions") as Transaction[];

  const total = transactions.reduce((spent: number, transaction) => {
    if (transaction.category_id === category.id) {
      return (
        spent +
        (Number(currencyRates[category.currency]) *
          Number(transaction.amount)) /
          Number(currencyRates[transaction.currency])
      );
    }
    return spent;
  }, 0);
  return total > 0 ? total : 0;
};

// Calculate Current Balance of Asset
export const getBalanceOfAsset = (asset: Asset): number => {
  const transactions = fetchData("transactions") as Transaction[];

  return transactions.reduce((balance: number, transaction) => {
    if (transaction.asset_id === asset.id) {
      balance +=
        transaction.type === "income"
          ? Number(transaction.amount)
          : -Number(transaction.amount);
      return balance;
    }
    return balance;
  }, Number(asset.initBalance));
};

// Get matching item
export const getAllMatchingItems = (
  table: string,
  key: string,
  value: string
) => {
  const data = fetchData(table);
  const filteredData = data.filter((d: DataItem) => d[key] === value);
  return filteredData;
};

// Get Currency Rates
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEY = "currencyRatesCache";

interface CachedRates {
  rates: { [key: string]: any };
  timestamp: number;
}

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

// Format Currency
export const formatCurrency = (amount: number, currency: string) => {
  return amount + " " + currency;
};

// Format Date
export const formatDate = (date: Date): string => {
  const day = new Date(date).getDate();
  const month = new Date(date).toLocaleString("default", { month: "long" });
  const year = new Date(date).getFullYear();

  return `${month} ${day}, ${year}`;
};

export const formatDateToInputValue = (date: Date): string => {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();

  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const monthStr = month < 10 ? `0${month}` : `${month}`;

  console.log(`${year}-${monthStr}-${dayStr}`, year, month, day);
  return `${year}-${monthStr}-${dayStr}`;
};
