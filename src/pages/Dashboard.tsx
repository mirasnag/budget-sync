// react imports
import { useEffect, useState } from "react";

// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import { DataItem, fetchData, getCurrencyRates } from "../api/helpers";

// components
import { Asset } from "../components/Dashboard/Assets";
import TransactionTable, {
  Transaction,
} from "../components/Dashboard/Transactions";
import Categories, { Category } from "../components/Dashboard/Categories";
import CurrencyWidget from "../components/CurrencyWidget";
import Assets from "../components/Dashboard/Assets";
// import Goals, { Goal } from "../components/Dashboard/Goals";

// loader
export async function dashboardLoader(): Promise<{
  assets: Asset[];
  transactions: Transaction[];
  categories: Category[];
  // goals: Goal[];
  currencyRates: DataItem;
}> {
  const assets = fetchData("assets") as Asset[];
  const transactions = fetchData("transactions") as Transaction[];
  const categories = fetchData("categories") as Category[];
  // const goals = fetchData("goals") as Goal[];
  const currencyRates = await getCurrencyRates();

  return { assets, transactions, categories, currencyRates };
}

const Dashboard: React.FC = () => {
  const { assets, transactions, categories, currencyRates } =
    useLoaderData() as {
      assets: Asset[];
      transactions: Transaction[];
      categories: Category[];
      // goals: Goal[];
      currencyRates: DataItem;
    };

  const [data, setData] = useState({
    assets,
    transactions,
    categories,
    // goals,
    currencyRates,
  });

  useEffect(() => {
    setData({
      assets,
      transactions,
      categories,
      // goals,
      currencyRates,
    });
  }, [assets, transactions, categories, currencyRates]);

  return (
    <>
      <div className="page">
        <CurrencyWidget rates={data.currencyRates} />
        <Assets assets={data.assets} currencyRates={data.currencyRates} />
        <Categories
          categories={data.categories}
          currencyRates={data.currencyRates}
        />
        {/* <Goals goals={data.goals} /> */}
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
