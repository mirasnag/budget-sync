// react imports
import { useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

// library imports
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

// helper functions
import {
  formatCurrency,
  getAllCurrencies,
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

export interface AssetsTableProps {
  assets: Asset[];
  showHeader?: boolean;
  period?: string[];
}

const AssetsTable: React.FC<AssetsTableProps> = ({
  assets,
  showHeader = true,
  period = ["this", "1", "month"],
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState("");
  const [assetPeriod, setAssetPeriod] = useState(period);

  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm("");
  };

  const tableHeader: string[] = [
    "Name",
    "Balance",
    "Total Income",
    "Total Expenses",
    "",
  ];
  const currencies = getAllCurrencies();

  return (
    <div className="assets">
      {showHeader && (
        <div className="header">
          <h2>Assets</h2>
          <div className="chart-menu">
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
      )}
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
            const { balance, expense, income } = getBalanceOfAsset(
              asset,
              showHeader ? assetPeriod : period
            );

            return (
              <tr key={index}>
                <td>
                  <div className="frame color-aqua">{asset.name}</div>
                </td>
                <td>{formatCurrency(balance, asset.currency)}</td>
                <td>{formatCurrency(income, asset.currency)}</td>
                <td>{formatCurrency(expense, asset.currency)}</td>
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

export default AssetsTable;
