// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import { getCurrencyRates } from "../utils/currency.util";

// interfaces
import { CurrencyRates } from "../utils/types";

// UI components
import CurrencyWidget from "../components/CurrencyWidget";
import TransactionTable from "../components/Dashboard/TransactionTable";

// loader
export async function transactionsPageLoader(): Promise<{
  currencyRates: CurrencyRates;
}> {
  const currencyRates = await getCurrencyRates();
  return { currencyRates };
}

const TransactionsPage = () => {
  const { currencyRates } = useLoaderData() as {
    currencyRates: CurrencyRates;
  };

  return (
    <div className="page">
      <CurrencyWidget rates={currencyRates} />
      <TransactionTable />
    </div>
  );
};

export default TransactionsPage;
