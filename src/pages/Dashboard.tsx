// react imports
import { useEffect, useState } from "react";

// rrd imports
import { ActionFunction, useLoaderData } from "react-router-dom";

// helper functions
import {
  DataItem,
  createAsset,
  createCategory,
  createTransaction,
  deleteAsset,
  deleteCategory,
  deleteItem,
  editAsset,
  editCategory,
  fetchData,
  getCurrencyRates,
} from "../api/helpers";

// components
import AssetsTable, { Asset } from "../components/Dashboard/Assets";
import TransactionTable, {
  Transaction,
} from "../components/Dashboard/Transactions";
import Categories, { Category } from "../components/Dashboard/Categories";
import CurrencyWidget from "../components/CurrencyWidget";

// loader
export async function dashboardLoader(): Promise<{
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
export const dashboardAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "createAsset") {
    try {
      createAsset({
        id: "",
        name: values.name as string,
        initBalance: values.initBalance as unknown as number,
        currency: values.currency as string,
      });
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Asset is not created!");
    }
  }

  if (_action === "editAsset") {
    try {
      editAsset(values.asset_id as string, values as unknown as Asset);
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
      createTransaction({
        id: "",
        name: values.name as string,
        asset_id: values.asset_id as string,
        category_id: values.category_id as string,
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

  if (_action === "createCategory") {
    try {
      createCategory({
        id: "",
        name: values.name as string,
        totalBudgeted: values.totalBudgeted as unknown as number,
        currency: values.currency as string,
      });
      return null;
    } catch (e) {
      console.log(e);
      throw new Error("Category is not created!");
    }
  }

  if (_action === "editCategory") {
    try {
      editCategory(values.category_id as string, values as unknown as Category);
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

const Dashboard: React.FC = () => {
  const { assets, transactions, categories, currencyRates } =
    useLoaderData() as {
      assets: Asset[];
      transactions: Transaction[];
      categories: Category[];
      currencyRates: DataItem;
    };

  const [data, setData] = useState({
    assets,
    transactions,
    categories,
    currencyRates,
  });

  useEffect(() => {
    setData({
      assets,
      transactions,
      categories,
      currencyRates,
    });
  }, [assets, transactions, categories, currencyRates]);

  return (
    <>
      <div className="grid-lg">
        <CurrencyWidget rates={data.currencyRates} />
        <AssetsTable assets={data.assets} />
        <Categories
          categories={data.categories}
          currencyRates={data.currencyRates}
          period={["this", "1", "month"]}
        />
        <TransactionTable
          transactions={data.transactions}
          assets={data.assets}
          categories={data.categories}
        />
      </div>
    </>
  );
};

export default Dashboard;
