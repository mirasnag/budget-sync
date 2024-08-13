// rrd imports
import { useLoaderData } from "react-router-dom";

// helper functions
import { DataItem, fetchData, getCurrencyRates } from "../api/helpers";

// interfaces
import AssetsTable, { Asset } from "../components/Assets";
import Categories, { Category } from "../components/Categories";
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

  const [categoryChartType, setCategoryChartType] = useState("horizontal-bar");
  const [assetChartType, setAssetChartType] = useState("table");

  const renderCategoryChart = () => {
    if (categoryChartType === "horizontal-bar") {
      return (
        <Categories
          categories={categories}
          currencyRates={currencyRates}
          showHeader={false}
        />
      );
    }
    if (categoryChartType === "vertical-bar") {
      return <CategoryBarChart categories={categories} />;
    }
    if (categoryChartType === "pie") {
      return (
        <CategoryPieChart
          categories={categories}
          currencyRates={currencyRates}
        />
      );
    }
    if (categoryChartType === "line") {
      return <CategoryLineChart categories={categories} />;
    }
    return (
      <Categories
        categories={categories}
        currencyRates={currencyRates}
        showHeader={false}
      />
    );
  };
  const renderAssetChart = () => {
    if (assetChartType === "table") {
      return <AssetsTable assets={assets} showHeader={false} />;
    }
    if (assetChartType === "vertical-bar") {
      return <AssetBarChart assets={assets} />;
    }
    if (assetChartType === "line") {
      return <AssetLineChart assets={assets} />;
    }
    return (
      <Categories
        categories={categories}
        currencyRates={currencyRates}
        showHeader={false}
      />
    );
  };

  return (
    <div className="charts">
      <div className="category-chart">
        <div className="header">
          <h2>Category Chart</h2>
          <select
            defaultValue={categoryChartType}
            onChange={(e) => setCategoryChartType(e.target.value)}
          >
            <option value="horizontal-bar">Horizontal Bar Chart</option>
            <option value="vertical-bar">Vertical Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>
        {renderCategoryChart()}
      </div>
      <div className="asset-chart">
        <div className="header">
          <h2>Asset Chart</h2>
          <select
            defaultValue={assetChartType}
            onChange={(e) => setAssetChartType(e.target.value)}
          >
            <option value="table">Table</option>
            <option value="vertical-bar">Vertical Bar Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>
        {renderAssetChart()}
      </div>
    </div>
  );
};

export default SpendingAnalysisPage;
