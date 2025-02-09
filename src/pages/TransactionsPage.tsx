// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import { getCurrencyRates } from "../utils/currency.util";

// interfaces
import { CurrencyRates } from "../utils/types";

// UI components
import CurrencyWidget from "../components/Dashboard/CurrencyWidget";
import Transactions from "../components/Dashboard/Transactions";

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
      <Transactions />
    </div>
  );
};

export default TransactionsPage;
