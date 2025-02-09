import React, {
  createContext,
  useReducer,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { fetchData } from "../utils/api";
import {
  CollectionType,
  ContextAction,
  ContextType,
  Transaction,
} from "../utils/types";

type TransactionAction = ContextAction<Transaction>;

// Create the reducer function
const transactionReducer = (
  state: Transaction[],
  action: TransactionAction
): Transaction[] => {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "ADD":
      return [...state, action.payload];
    case "DELETE":
      return state.filter((transaction) => transaction.id !== action.payload);
    case "EDIT":
      return state.map((transaction) =>
        transaction.id === action.payload.id
          ? { ...transaction, [action.payload.prop]: action.payload.value }
          : transaction
      );
    default:
      return state;
  }
};

const TransactionContext = createContext<ContextType<Transaction> | undefined>(
  undefined
);

const initialValue = [] as Transaction[];

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [transactions, transactionDispatch] = useReducer(
    transactionReducer,
    initialValue
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedData = (await fetchData(
        CollectionType.TRANSACTIONS
      )) as Transaction[];
      transactionDispatch({ type: "INIT", payload: fetchedData });
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      CollectionType.TRANSACTIONS,
      JSON.stringify(transactions)
    );
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{ data: transactions, dispatch: transactionDispatch }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider"
    );
  }
  return context;
};
