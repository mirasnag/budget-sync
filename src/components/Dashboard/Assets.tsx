// react imports
import { useState } from "react";

// interfaces
import { CurrencyRates } from "../../utils/types";

// components
import PeriodSelector, { Period } from "../Controls/PeriodSelector";
import CurrencySelector from "../Currency/CurrencySelector";

// context
import AssetTable from "../Asset/AssetTable";

interface AssetsProps {
  currencyRates: CurrencyRates;
}

const Assets: React.FC<AssetsProps> = ({ currencyRates }) => {
  const [assetPeriod, setAssetPeriod] = useState<Period>({
    type: "relative",
    option: "This",
    value: null,
    unit: "Month",
  });
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);

  return (
    <div className="assets component">
      <div className="header">
        <h2>Assets</h2>
        <div className="header-menu">
          <CurrencySelector
            baseCurrency={baseCurrency}
            setBaseCurrency={setBaseCurrency}
          />
          <PeriodSelector period={assetPeriod} setPeriod={setAssetPeriod} />
        </div>
      </div>

      <AssetTable
        baseCurrency={baseCurrency}
        period={assetPeriod}
        currencyRates={currencyRates}
      />
    </div>
  );
};

export default Assets;
