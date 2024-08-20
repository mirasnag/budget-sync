// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import {
  DataItem,
  fetchData,
  formatCurrency,
  getAllCurrencies,
  getAssetBalanceHistory,
  getCategorySpentHistory,
  getCurrencyRates,
} from "../api/helpers";

// interfaces
import { Asset } from "../components/Dashboard/Assets";
import { Category } from "../components/Dashboard/Categories";
import CategoryPieChart from "../components/Charts/CategoryPieChart";
import AssetLineChart from "../components/Charts/AssetLineChart";
import { useState } from "react";
import CategoryLineChart from "../components/Charts/CategoryLineChart";
import CategoryBarChart from "../components/Charts/CategoryBarChart";
import AssetBarChart from "../components/Charts/AssetBarChart";
import AssetTable from "../components/Charts/AssetTable";
import CategoryTable from "../components/Charts/CategoryTable";
import CurrencyWidget from "../components/CurrencyWidget";

// loader
export async function spendingAnalysisLoader(): Promise<{
  assets: Asset[];
  categories: Category[];
  currencyRates: DataItem;
}> {
  const assets = fetchData("assets") as Asset[];
  const categories = fetchData("categories") as Category[];
  const currencyRates = await getCurrencyRates();

  return { assets, categories, currencyRates };
}

const SpendingAnalysisPage: React.FC = () => {
  const { assets, categories, currencyRates } = useLoaderData() as {
    assets: Asset[];
    categories: Category[];
    currencyRates: DataItem;
  };

  const [assetChartType, setAssetChartType] = useState("table");
  const [assetPeriod, setAssetPeriod] = useState(["this", "1", "month"]);
  const [assetBaseCurrency, setAssetBaseCurrency] = useState<string | null>(
    null
  );
  const assetData =
    getAssetBalanceHistory(assetPeriod, assetBaseCurrency, currencyRates) ?? [];

  const [categoryChartType, setCategoryChartType] = useState("table");
  const [categoryPeriod, setCategoryPeriod] = useState(["this", "1", "month"]);
  const [categoryBaseCurrency, setCategoryBaseCurrency] = useState<
    string | null
  >(null);
  const categoryData =
    getCategorySpentHistory(
      categoryPeriod,
      categoryBaseCurrency,
      currencyRates
    ) ?? [];

  const currencies = getAllCurrencies();

  const renderAssetChart = () => {
    if (assetChartType === "table") {
      return (
        <AssetTable
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
      <AssetTable
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
        <CategoryTable
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
      <CategoryTable
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
              <select
                defaultValue={assetBaseCurrency ?? ""}
                onChange={(e) =>
                  setAssetBaseCurrency(
                    e.target.value === "" ? null : e.target.value
                  )
                }
              >
                <option key="" value="">
                  {assetBaseCurrency ? "Revert" : "Convert"}
                </option>
                {currencies.map((currency) => {
                  return (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  );
                })}
              </select>
              <div className="period-selector">
                <select
                  defaultValue={assetPeriod[0]}
                  onChange={(e) => {
                    setAssetPeriod([
                      e.target.value,
                      assetPeriod[1],
                      assetPeriod[2],
                    ]);
                  }}
                >
                  <option value="past">Past</option>
                  <option value="this">This</option>
                  <option value="next">Next</option>
                </select>
                {assetPeriod[0] !== "this" && (
                  <input
                    type="number"
                    defaultValue={assetPeriod[1]}
                    min={1}
                    max={99}
                    onChange={(e) => {
                      setAssetPeriod([
                        assetPeriod[0],
                        e.target.value,
                        assetPeriod[2],
                      ]);
                    }}
                  />
                )}
                <select
                  defaultValue={assetPeriod[2]}
                  onChange={(e) => {
                    setAssetPeriod([
                      assetPeriod[0],
                      assetPeriod[1],
                      e.target.value,
                    ]);
                  }}
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
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
              <select
                defaultValue={categoryBaseCurrency ?? ""}
                onChange={(e) =>
                  setCategoryBaseCurrency(
                    e.target.value === "" ? null : e.target.value
                  )
                }
              >
                <option key="" value="">
                  {categoryBaseCurrency ? "Revert" : "Convert"}
                </option>
                {currencies.map((currency) => {
                  return (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  );
                })}
              </select>
              <div className="period-selector">
                <select
                  defaultValue={categoryPeriod[0]}
                  onChange={(e) => {
                    setCategoryPeriod([
                      e.target.value,
                      categoryPeriod[1],
                      categoryPeriod[2],
                    ]);
                  }}
                >
                  <option value="past">Past</option>
                  <option value="this">This</option>
                  <option value="next">Next</option>
                </select>
                {categoryPeriod[0] !== "this" && (
                  <input
                    type="number"
                    defaultValue={categoryPeriod[1]}
                    min={1}
                    max={99}
                    onChange={(e) => {
                      setCategoryPeriod([
                        categoryPeriod[0],
                        e.target.value,
                        categoryPeriod[2],
                      ]);
                    }}
                  />
                )}
                <select
                  defaultValue={categoryPeriod[2]}
                  onChange={(e) => {
                    setCategoryPeriod([
                      categoryPeriod[0],
                      categoryPeriod[1],
                      e.target.value,
                    ]);
                  }}
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
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
