// rrd imports
import { ActionFunction, useLoaderData } from "react-router-dom";

// helper functions
import {
  DataItem,
  createTransaction,
  deleteItem,
  fetchData,
  getCurrencyRates,
} from "../api/helpers";

// interfaces
import { Asset } from "../components/Dashboard/Assets";
import { Category } from "../components/Dashboard/Categories";
import TransactionTable, {
  Transaction,
} from "../components/Dashboard/Transactions";
import CurrencyWidget from "../components/CurrencyWidget";

// loader
export async function transactionsPageLoader(): Promise<{
  assets: Asset[];
  transactions: Transaction[];
  categories: Category[];
  currencyRates: DataItem;
}> {
  const assets = fetchData("assets") as Asset[];
  const transactions = fetchData("transactions") as Transaction[];
  const categories = fetchData("categories") as Category[];
  const currencyRates = await getCurrencyRates();

  return { assets, transactions, categories, currencyRates };
}

// action
export const transactionsPageAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  if (_action === "createTransaction") {
    try {
      createTransaction({
        id: "",
        name: values.name as string,
        asset_id: values.asset_id as string,
        category_id: values.category_id as string,
        source: values.source as string,
        asset_from_id: values.asset_from_id as string,
        amount: values.amount as unknown as number,
        currency: values.currency as string,
        date: new Date(values.date as string) as Date,
        createdAt: Date.now() as unknown as Date,
        type: values.type as string,
      });
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Transaction is not created!");
    }
  }

  if (_action === "editTransaction") {
    try {
      deleteItem("transactions", "id", values.transaction_id as string);
      createTransaction({
        id: values.transaction_id as string,
        name: values.name as string,
        asset_id: values.asset_id as string,
        category_id: values.category_id as string,
        source: values.source as string,
        asset_from_id: values.asset_from_id as string,
        amount: values.amount as unknown as number,
        currency: values.currency as string,
        date: new Date(values.date as string) as Date,
        createdAt: Date.now() as unknown as Date,
        type: values.type as string,
      });
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Transaction is not updated!");
    }
  }

  if (_action === "deleteTransaction") {
    try {
      deleteItem("transactions", "id", values.transaction_id as string);
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Transaction is not deleted!");
    }
  }
};

const TransactionsPage = () => {
  const { assets, transactions, categories, currencyRates } =
    useLoaderData() as {
      assets: Asset[];
      transactions: Transaction[];
      categories: Category[];
      currencyRates: DataItem[];
    };

  return (
    <div className="grid-lg">
      <CurrencyWidget rates={currencyRates} />
      <TransactionTable
        assets={assets}
        transactions={transactions.sort((a, b) =>
          a.createdAt < b.createdAt ? 1 : -1
        )}
        categories={categories}
        isRecent={false}
      />
    </div>
  );
};

export default TransactionsPage;
