// rrd imports
import { useLoaderData } from "react-router-dom";

// react imports
import { useState } from "react";

// UI components
import CategoryPieChart from "../components/Charts/CategoryPieChart";
import AssetLineChart from "../components/Charts/AssetLineChart";
import CategoryLineChart from "../components/Charts/CategoryLineChart";
import CategoryBarChart from "../components/Charts/CategoryBarChart";
import AssetBarChart from "../components/Charts/AssetBarChart";
import AssetTableChart from "../components/Charts/AssetTableChart";
import CategoryTableChart from "../components/Charts/CategoryTableChart";
import CurrencyWidget from "../components/Dashboard/CurrencyWidget";
import PeriodSelector, { Period } from "../components/Controls/PeriodSelector";
import CurrencySelector from "../components/Currency/CurrencySelector";

// interfaces
import { CurrencyRates } from "../utils/types";

// helper functions
import { getCurrencyRates } from "../utils/currency.util";
import {
  getAssetBalanceHistory,
  getCategorySpentHistory,
} from "../utils/entities.util";
import { formatCurrency } from "../utils/formatting";

// context
import { useAssetContext } from "../store/asset-context";
import { useCategoryContext } from "../store/category-context";
import { useTransactionContext } from "../store/transaction-context";

// loader
export async function spendingAnalysisLoader(): Promise<{
  currencyRates: CurrencyRates;
}> {
  const currencyRates = await getCurrencyRates();

  return { currencyRates };
}

const SpendingAnalysisPage: React.FC = () => {
  const { currencyRates } = useLoaderData() as {
    currencyRates: CurrencyRates;
  };
  const { data: assets } = useAssetContext();
  const { data: categories } = useCategoryContext();
  const { data: transactions } = useTransactionContext();

  const [assetChartType, setAssetChartType] = useState("table");
  const [assetPeriod, setAssetPeriod] = useState<Period>({
    type: "relative",
    option: "This",
    value: null,
    unit: "Month",
  });
  const [assetBaseCurrency, setAssetBaseCurrency] = useState<string | null>(
    null
  );
  const assetData =
    getAssetBalanceHistory(
      assets,
      transactions,
      assetPeriod,
      assetBaseCurrency,
      currencyRates
    ) ?? [];

  const [categoryChartType, setCategoryChartType] = useState("table");
  const [categoryPeriod, setCategoryPeriod] = useState<Period>({
    type: "relative",
    option: "This",
    value: null,
    unit: "Month",
  });
  const [categoryBaseCurrency, setCategoryBaseCurrency] = useState<
    string | null
  >(null);
  const categoryData =
    getCategorySpentHistory(
      categories,
      transactions,
      categoryPeriod,
      categoryBaseCurrency,
      currencyRates
    ) ?? [];

  const renderAssetChart = () => {
    if (assetChartType === "table") {
      return (
        <AssetTableChart
          assets={assets}
          data={assetData}
          formatter={(value, index) =>
            formatCurrency(value, assetBaseCurrency ?? assets[index].currency)
          }
        />
      );
    }
    if (assetChartType === "bar") {
      return (
        <AssetBarChart
          assets={assets}
          data={assetData}
          formatter={(value, index) =>
            formatCurrency(value, assetBaseCurrency ?? assets[index].currency)
          }
        />
      );
    }
    if (assetChartType === "line") {
      return (
        <AssetLineChart
          assets={assets}
          data={assetData}
          formatter={(value, index) =>
            formatCurrency(value, assetBaseCurrency ?? assets[index].currency)
          }
        />
      );
    }
    return (
      <AssetTableChart
        assets={assets}
        data={assetData}
        formatter={(value, index) =>
          formatCurrency(value, assetBaseCurrency ?? assets[index].currency)
        }
      />
    );
  };

  const renderCategoryChart = () => {
    if (categoryChartType === "table") {
      return (
        <CategoryTableChart
          categories={categories}
          data={categoryData}
          formatter={(value, index) =>
            formatCurrency(
              value,
              categoryBaseCurrency ?? categories[index].currency
            )
          }
        />
      );
    }
    if (categoryChartType === "bar") {
      return (
        <CategoryBarChart
          categories={categories}
          data={categoryData}
          formatter={(value, index) =>
            formatCurrency(
              value,
              categoryBaseCurrency ?? categories[index].currency
            )
          }
        />
      );
    }
    if (categoryChartType === "pie") {
      return (
        <CategoryPieChart
          categories={categories}
          data={categoryData}
          formatter={(value, index) =>
            formatCurrency(
              value,
              categoryBaseCurrency ?? categories[index].currency
            )
          }
        />
      );
    }
    if (categoryChartType === "line") {
      return (
        <CategoryLineChart
          categories={categories}
          data={categoryData}
          formatter={(value, index) =>
            formatCurrency(
              value,
              categoryBaseCurrency ?? categories[index].currency
            )
          }
        />
      );
    }

    return (
      <CategoryTableChart
        categories={categories}
        data={categoryData}
        formatter={(value, index) =>
          formatCurrency(
            value,
            categoryBaseCurrency ?? categories[index].currency
          )
        }
      />
    );
  };

  return (
    <>
      <div className="page charts">
        <CurrencyWidget rates={currencyRates} />
        <div className="asset-chart">
          <div className="header">
            <h2>Asset Chart</h2>
            <div className="header-menu">
              <CurrencySelector
                baseCurrency={assetBaseCurrency}
                setBaseCurrency={setAssetBaseCurrency}
              />
              <PeriodSelector period={assetPeriod} setPeriod={setAssetPeriod} />
              <select
                defaultValue={assetChartType}
                onChange={(e) => setAssetChartType(e.target.value)}
              >
                <option value="table">Table</option>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          </div>
          {renderAssetChart()}
        </div>
        <div className="category-chart">
          <div className="header">
            <h2>Category Chart</h2>
            <div className="header-menu">
              <CurrencySelector
                baseCurrency={categoryBaseCurrency}
                setBaseCurrency={setCategoryBaseCurrency}
              />
              <PeriodSelector
                period={categoryPeriod}
                setPeriod={setCategoryPeriod}
              />
              <select
                defaultValue={categoryChartType}
                onChange={(e) => setCategoryChartType(e.target.value)}
              >
                <option value="table">Table</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          </div>
          {renderCategoryChart()}
        </div>
      </div>
    </>
  );
};

export default SpendingAnalysisPage;
