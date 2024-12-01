// react imports
import { useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

// helper functions
import {
  convertCurrency,
  formatCurrency,
  getAssetDetails,
  getBalanceOfAsset,
} from "../../api/helpers";

// interfaces
import { Asset, CurrencyRates } from "../../api/dataModels";

// components
import AssetForm from "./AssetForm";
import AddButton from "../Buttons/AddButton";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import PeriodSelector, { Period } from "../Buttons/PeriodSelector";
import CurrencySelector from "../Buttons/CurrencySelector";

export interface AssetsProps {
  assets: Asset[];
  currencyRates: CurrencyRates;
  showHeader?: boolean;
  period?: string[];
}

const Assets: React.FC<AssetsProps> = ({ assets, currencyRates }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState("");
  const [assetPeriod, setAssetPeriod] = useState<Period>({
    type: "relative",
    option: "This",
    value: null,
    unit: "Month",
  });
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);

  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm("");
  };

  const tableHeader: string[] = ["Name", "Balance", "Income", "Expenses", ""];
  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpense = 0;

  return (
    <div className="assets component">
      <div className="header">
        <h2>Assets</h2>
        <div className="header-menu">
          <CurrencySelector
            baseCurrency={baseCurrency}
            setBaseCurrency={setBaseCurrency}
          />
          <AddButton handleClick={() => setShowCreateForm(true)} />
          <PeriodSelector period={assetPeriod} setPeriod={setAssetPeriod} />
        </div>
      </div>

      <table>
        <thead>
          <tr style={{ borderBottom: "1px solid #888" }}>
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
                  <div className="frame color-blue">{asset.name}</div>
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
                    <EditButton handleClick={() => setShowEditForm(asset.id)} />
                    <Form method="post">
                      <input type="hidden" name="_action" value="deleteAsset" />
                      <input type="hidden" name="asset_id" value={asset.id} />
                      <DeleteButton />
                    </Form>
                  </div>
                </td>
              </tr>
            );
          })}

          <tr key="summary" style={{ borderTop: "1px solid #888" }}>
            <td>
              <div className="frame color-blue">Total</div>
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

      {showCreateForm && <AssetForm onClose={closeForm} asset_id="" />}

      {showEditForm !== "" && (
        <AssetForm onClose={closeForm} asset_id={showEditForm} />
      )}
    </div>
  );
};

export default Assets;
