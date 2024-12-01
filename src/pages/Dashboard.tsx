// react imports
import { useEffect, useState } from "react";

// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import { fetchData } from "../utils/services";
import { getCurrencyRates } from "../utils/currency.util";

// interfaces
import {
  Asset,
  Category,
  CollectionType,
  CurrencyRates,
  Transaction,
} from "../utils/types";

// components
import TransactionTable from "../components/Dashboard/Transactions";
import Assets from "../components/Dashboard/Assets";
import Categories from "../components/Dashboard/Categories";
import CurrencyWidget from "../components/CurrencyWidget";
// import Goals, { Goal } from "../components/Dashboard/Goals";

// loader
export async function dashboardLoader(): Promise<{
  assets: Asset[];
  transactions: Transaction[];
  categories: Category[];
  // goals: Goal[];
  currencyRates: CurrencyRates;
}> {
  const assets = fetchData(CollectionType.ASSETS) as Asset[];
  const transactions = fetchData(CollectionType.TRANSACTIONS) as Transaction[];
  const categories = fetchData(CollectionType.CATEGORIES) as Category[];
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
      currencyRates: CurrencyRates;
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
