// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import { DataItem, fetchData, getCurrencyRates } from "../api/helpers";

// interfaces
import AssetsTable, { Asset } from "../components/Dashboard/Assets";
import Categories, { Category } from "../components/Dashboard/Categories";
import CategoryPieChart from "../components/Charts/CategoryPieChart";
import AssetLineChart from "../components/Charts/AssetLineChart";
import { useState } from "react";
import CategoryLineChart from "../components/Charts/CategoryLineChart";
import CategoryBarChart from "../components/Charts/CategoryBarChart";
import AssetBarChart from "../components/Charts/AssetBarChart";

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

  const [categoryChartType, setCategoryChartType] = useState("table");
  const [categoryPeriod, setCategoryPeriod] = useState(["this", "1", "month"]);
  const [assetChartType, setAssetChartType] = useState("table");
  const [assetPeriod, setAssetPeriod] = useState(["this", "1", "month"]);

  const renderCategoryChart = () => {
    if (categoryChartType === "table") {
      return (
        <Categories
          categories={categories}
          currencyRates={currencyRates}
          period={categoryPeriod}
          showHeader={false}
        />
      );
    }
    if (categoryChartType === "bar") {
      return (
        <CategoryBarChart categories={categories} period={categoryPeriod} />
      );
    }
    if (categoryChartType === "pie") {
      return (
        <CategoryPieChart
          categories={categories}
          currencyRates={currencyRates}
          period={categoryPeriod}
        />
      );
    }
    if (categoryChartType === "line") {
      return (
        <CategoryLineChart categories={categories} period={categoryPeriod} />
      );
    }
    return (
      <Categories
        categories={categories}
        currencyRates={currencyRates}
        showHeader={false}
        period={categoryPeriod}
      />
    );
  };

  const renderAssetChart = () => {
    if (assetChartType === "table") {
      return (
        <AssetsTable assets={assets} showHeader={false} period={assetPeriod} />
      );
    }
    if (assetChartType === "bar") {
      return <AssetBarChart assets={assets} period={assetPeriod} />;
    }
    if (assetChartType === "line") {
      return <AssetLineChart assets={assets} period={assetPeriod} />;
    }
    return (
      <AssetsTable assets={assets} showHeader={false} period={assetPeriod} />
    );
  };

  return (
    <div className="charts">
      <div className="asset-chart">
        <div className="header">
          <h2>Asset Chart</h2>
          <div className="chart-menu">
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
          <div className="chart-menu">
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
  );
};

export default SpendingAnalysisPage;
