import { getItemById } from "./services";
import {
  FilterInstanceType,
  SortInstanceType,
} from "../components/Dashboard/Transactions";
import { Entity, Transaction } from "./types";

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

export const filterTransactions = (
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
