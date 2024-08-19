// react imports
import { useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

// library imports
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

// helper functions
import {
  DataItem,
  convertCurrency,
  formatCurrency,
  getAllCurrencies,
  getAssetDetails,
  getBalanceOfAsset,
} from "../../api/helpers";

// components
import AssetForm from "./AssetForm";

export interface Asset {
  id: string;
  name: string;
  initBalance: number;
  currency: string;
}

export interface AssetsProps {
  assets: Asset[];
  currencyRates: DataItem;
  showHeader?: boolean;
  period?: string[];
}

const Assets: React.FC<AssetsProps> = ({ assets, currencyRates }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState("");
  const [assetPeriod, setAssetPeriod] = useState(["this", "1", "month"]);
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);

  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm("");
  };

  const tableHeader: string[] = ["Name", "Balance", "Income", "Expenses", ""];
  const currencies = getAllCurrencies();
  let totalBalance = 0,
    totalIncome = 0,
    totalExpense = 0;

  return (
    <div className="assets">
      <div className="header">
        <h2>Assets</h2>
        <div className="chart-menu">
          <select
            defaultValue={baseCurrency ?? ""}
            onChange={(e) =>
              setBaseCurrency(e.target.value === "" ? null : e.target.value)
            }
          >
            <option key={""} value="">
              {baseCurrency ? "Revert" : "Convert"}
            </option>
            {currencies.map((currency) => {
              return (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              );
            })}
          </select>
          <button
            className="btn btn-green"
            onClick={() => setShowCreateForm(true)}
          >
            <PlusIcon width={20} />
          </button>
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
        </div>
      </div>

      <table>
        <thead>
          <tr>
            {tableHeader.map((t, index) => (
              <th key={index}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => {
            let balance = getBalanceOfAsset(asset);
            let { income, expense } = getAssetDetails(asset, assetPeriod);

            if (baseCurrency) {
              balance = convertCurrency(
                currencyRates,
                asset.currency,
                baseCurrency,
                balance
              );
              expense = convertCurrency(
                currencyRates,
                asset.currency,
                baseCurrency,
                expense
              );
              income = convertCurrency(
                currencyRates,
                asset.currency,
                baseCurrency,
                income
              );

              totalBalance += +balance;
              totalExpense += +expense;
              totalIncome += +income;
            }

            return (
              <tr key={index}>
                <td>
                  <div className="frame color-aqua">{asset.name}</div>
                </td>
                <td>
                  {formatCurrency(balance, baseCurrency ?? asset.currency)}
                </td>
                <td>
                  {formatCurrency(income, baseCurrency ?? asset.currency)}
                </td>
                <td>
                  {formatCurrency(expense, baseCurrency ?? asset.currency)}
                </td>
                <td>
                  <div className="table-btns">
                    <button
                      onClick={() => setShowEditForm(asset.id)}
                      className="btn"
                    >
                      <PencilIcon width={20} />
                    </button>
                    <Form method="post">
                      <input type="hidden" name="_action" value="deleteAsset" />
                      <input type="hidden" name="asset_id" value={asset.id} />
                      <button type="submit" className="btn btn-red">
                        <TrashIcon width={20} />
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            );
          })}

          <tr key="summary">
            <td>
              <div className="frame color-white">Total</div>
            </td>
            <td>
              {baseCurrency ? formatCurrency(totalBalance, baseCurrency) : ""}
            </td>
            <td>
              {baseCurrency ? formatCurrency(totalIncome, baseCurrency) : ""}
            </td>
            <td>
              {baseCurrency ? formatCurrency(totalExpense, baseCurrency) : ""}
            </td>
          </tr>
        </tbody>
      </table>

      {showCreateForm && (
        <AssetForm currencies={currencies} onClose={closeForm} asset_id="" />
      )}

      {showEditForm !== "" && (
        <AssetForm
          currencies={currencies}
          onClose={closeForm}
          asset_id={showEditForm}
        />
      )}
    </div>
  );
};

export default Assets;
