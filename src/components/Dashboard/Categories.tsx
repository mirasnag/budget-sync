// react imports
import { useState } from "react";

// interfaces
import { CurrencyRates } from "../../utils/types";

// components
import PeriodSelector, { Period } from "../Controls/PeriodSelector";
import CurrencySelector from "../Currency/CurrencySelector";
import CategoryTable from "../Category/CategoryTable";

interface CategoriesProps {
  currencyRates: CurrencyRates;
}

const Categories: React.FC<CategoriesProps> = ({ currencyRates }) => {
  const [categoryPeriod, setCategoryPeriod] = useState<Period>({
    type: "relative",
    option: "This",
    value: null,
    unit: "Month",
  });
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);

  return (
    <div className="categories component">
      <div className="header">
        <h2>Categories</h2>
        <div className="header-menu">
          <CurrencySelector
            baseCurrency={baseCurrency}
            setBaseCurrency={setBaseCurrency}
          />
          <PeriodSelector
            period={categoryPeriod}
            setPeriod={setCategoryPeriod}
          />
        </div>
      </div>

      <CategoryTable
        baseCurrency={baseCurrency}
        period={categoryPeriod}
        currencyRates={currencyRates}
      />
    </div>
  );
};

export default Categories;
