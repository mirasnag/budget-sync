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
  const assets = fetchData(CollectionType.ASSETS) as Asset[];
  const transactions = fetchData(CollectionType.TRANSACTIONS) as Transaction[];
  const categories = fetchData(CollectionType.CATEGORIES) as Category[];
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
