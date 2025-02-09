// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import { getCurrencyRates } from "../utils/currency.util";

// interfaces
import { CurrencyRates } from "../utils/types";

// components
import Assets from "../components/Dashboard/Assets";
import Categories from "../components/Dashboard/Categories";
import Transactions from "../components/Dashboard/Transactions";
import CurrencyWidget from "../components/Dashboard/CurrencyWidget";

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
        <Transactions />
      </div>
    </>
  );
};

export default Dashboard;
