import { Period } from "../components/Buttons/PeriodSelector";
import { convertCurrency } from "./currency.util";
import { formatDateToInputValue } from "./formatting";
import { fetchData } from "./services";
import {
  filterTransactions,
  getTransactionNodes,
  sortFilterTransactions,
} from "./transactions.util";
import {
  Asset,
  Category,
  CollectionType,
  CurrencyRates,
  Transaction,
  TransactionType,
} from "./types";

// Calculate Spent By Category
export const spentByCategory = (
  category: Category,
  currencyRates: CurrencyRates,
  period: Period,
  transactions: Transaction[]
) => {
  const filteredTransactions = filterTransactions(
    transactions,
    "Date",
    convertPeriodToString(period)
  );

  const total = filteredTransactions.reduce((spent: number, transaction) => {
    if (
      transaction.type === TransactionType.EXPENSE &&
      transaction.dst?.id === category.id
    ) {
      const { source, destination } = getTransactionNodes(transaction);

      return (
        spent +
        convertCurrency(
          currencyRates,
          source?.currency,
          destination?.currency,
          transaction.dstAmount ?? 0
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
  rates: CurrencyRates,
  transactions: Transaction[]
) => {
  const filteredTransactions = sortFilterTransactions(
    transactions,
    "Date",
    convertPeriodToString(period),
    "Date",
    "Ascending"
  ) as Transaction[];
  if (!filteredTransactions || filteredTransactions.length === 0)
    return undefined;

  const categories = fetchData(CollectionType.CATEGORIES) as Category[];

  const months: string[] = [];
  const startDate = new Date(filteredTransactions[0].date ?? "");
  const endDate = new Date(
    filteredTransactions[filteredTransactions.length - 1].date ?? ""
  );

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

  filteredTransactions.forEach((transaction) => {
    const month = new Date(transaction.date ?? "").toISOString().slice(0, 7);
    const category = categories.find((a) => a.id === transaction.dst?.id);
    if (category) {
      spentHistoryMap[month][category.name] += transaction.dstAmount ?? 0;
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
export const getBalanceOfAsset = (
  asset: Asset,
  transactions: Transaction[]
) => {
  let balance: number = 0;
  const now = new Date();

  transactions.forEach((transaction) => {
    if (
      new Date(transaction.date ?? "") < new Date(now) &&
      transaction.src.id === asset.id
    ) {
      balance -= transaction.srcAmount ?? 0;
    } else if (
      new Date(transaction.date ?? "") < new Date(now) &&
      transaction.dst.id === asset.id
    ) {
      balance += transaction.dstAmount ?? 0;
    }
  });

  return balance;
};

export const getAssetDetails = (
  asset: Asset,
  period: Period,
  transactions: Transaction[]
) => {
  const filteredTransactions = filterTransactions(
    transactions,
    "Date",
    convertPeriodToString(period)
  );
  const data = {
    income: 0,
    expense: 0,
    transfer: 0,
  };

  filteredTransactions.forEach((transaction) => {
    if (transaction.src.id === asset.id)
      data[transaction.type] -= transaction.srcAmount ?? 0;
    else if (transaction.dst.id === asset.id)
      data[transaction.type] += transaction.dstAmount ?? 0;
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
  const startDate = new Date(transactions[0].date ?? "");
  const endDate = new Date(transactions[transactions.length - 1].date ?? "");
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
    const month = new Date(transaction.date ?? "").toISOString().slice(0, 7);
    const { source, destination } = getTransactionNodes(transaction);
    switch (transaction.type) {
      case "income":
        balanceHistoryMap[month][destination.name] += transaction.dstAmount;
        break;
      case "expense":
        balanceHistoryMap[month][source.name] -= transaction.srcAmount ?? 0;
        break;
      case "transfer":
        balanceHistoryMap[month][source.name] -= transaction.srcAmount ?? 0;
        balanceHistoryMap[month][destination.name] += transaction.dstAmount;
        break;
    }
  });

  const curBalances = assets.map((_) => 0);

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
