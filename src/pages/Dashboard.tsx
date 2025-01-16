// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import { getCurrencyRates } from "../utils/currency.util";

// interfaces
import { CurrencyRates } from "../utils/types";

// components
import TransactionTable from "../components/Dashboard/Transactions";
import Assets from "../components/Dashboard/Assets";
import Categories from "../components/Dashboard/Categories";
import CurrencyWidget from "../components/CurrencyWidget";

// loader
export async function dashboardLoader(): Promise<{
  currencyRates: CurrencyRates;
}> {
  const currencyRates = await getCurrencyRates();
  return { currencyRates };
}

const Dashboard: React.FC = () => {
  const { currencyRates } = useLoaderData() as {
    currencyRates: CurrencyRates;
  };

  return (
    <>
      <div className="page">
        <CurrencyWidget rates={currencyRates} />
        <Assets currencyRates={currencyRates} />
        <Categories currencyRates={currencyRates} />
        <TransactionTable />
      </div>
    </>
  );
};

export default Dashboard;
