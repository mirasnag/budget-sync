// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import { fetchData, getCurrencyRates } from "../api/helpers";

// interfaces
import { Asset, Category, CurrencyRates, Transaction } from "../api/dataModels";

// UI components
import CurrencyWidget from "../components/CurrencyWidget";
import TransactionTable from "../components/Dashboard/Transactions";

// loader
export async function transactionsPageLoader(): Promise<{
  assets: Asset[];
  transactions: Transaction[];
  categories: Category[];
  currencyRates: CurrencyRates;
}> {
  const assets = fetchData("assets") as Asset[];
  const transactions = fetchData("transactions") as Transaction[];
  const categories = fetchData("categories") as Category[];
  const currencyRates = await getCurrencyRates();

  return { assets, transactions, categories, currencyRates };
}

const TransactionsPage = () => {
  const { assets, transactions, categories, currencyRates } =
    useLoaderData() as {
      assets: Asset[];
      transactions: Transaction[];
      categories: Category[];
      currencyRates: CurrencyRates;
    };

  return (
    <div className="page">
      <CurrencyWidget rates={currencyRates} />
      <TransactionTable
        assets={assets}
        transactions={transactions.sort((a, b) =>
          a.createdAt < b.createdAt ? 1 : -1
        )}
        categories={categories}
      />
    </div>
  );
};

export default TransactionsPage;
