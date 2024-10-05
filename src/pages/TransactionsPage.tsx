// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import { DataItem, fetchData, getCurrencyRates } from "../api/helpers";

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

const TransactionsPage = () => {
  const { assets, transactions, categories, currencyRates } =
    useLoaderData() as {
      assets: Asset[];
      transactions: Transaction[];
      categories: Category[];
      currencyRates: DataItem[];
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
        isRecent={false}
      />
    </div>
  );
};

export default TransactionsPage;
