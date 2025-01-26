// react imports
import { useState } from "react";

// interfaces
import { CurrencyRates } from "../../utils/types";

// components
import AssetForm from "./AssetForm";
import AddButton from "../Editors/AddButton";
import DeleteButton from "../Editors/DeleteButton";
import PeriodSelector, { Period } from "../Editors/PeriodSelector";
import CurrencySelector from "../Editors/CurrencySelector";

// helper funtions
import { getAssetDetails, getBalanceOfAsset } from "../../utils/entities.util";
import { convertCurrency } from "../../utils/currency.util";
import { formatCurrency } from "../../utils/formatting";
import { useAssetContext } from "../../store/asset-context";
import CurrencySelector2 from "../Editors/CurrencySelector2";

export interface AssetsProps {
  currencyRates: CurrencyRates;
}

const Assets: React.FC<AssetsProps> = ({ currencyRates }) => {
  const { data: assets, dispatch: assetDispatch } = useAssetContext();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [assetPeriod, setAssetPeriod] = useState<Period>({
    type: "relative",
    option: "This",
    value: null,
    unit: "Month",
  });
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);

  const closeForm = () => {
    setShowCreateForm(false);
  };

  const tableHeader: string[] = [
    "Name",
    "Balance",
    "Income",
    "Expenses",
    "Currency",
    "",
  ];

  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpense = 0;

  const deleteAsset = (id: string) => {
    assetDispatch({
      type: "DELETE",
      payload: id,
    });
  };

  const handleCurrencyChange = (asset_id: string, newValue: string) => {
    assetDispatch({
      type: "EDIT",
      payload: {
        id: asset_id,
        prop: "currency",
        value: newValue,
      },
    });
  };

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
                  <input
                    type="text"
                    defaultValue={asset.name}
                    onInput={(e) => {
                      const newValue = e.currentTarget.value;
                      assetDispatch({
                        type: "EDIT",
                        payload: {
                          id: asset.id,
                          prop: "name",
                          value: newValue,
                        },
                      });
                    }}
                  />
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
                  <CurrencySelector2
                    initialValue={asset.currency ?? "USD"}
                    setValue={(newValue) =>
                      handleCurrencyChange(asset.id, newValue)
                    }
                  />{" "}
                </td>
                <td>
                  <div className="table-btns">
                    <DeleteButton handleClick={() => deleteAsset(asset.id)} />
                  </div>
                </td>
              </tr>
            );
          })}

          <tr key="summary">
            <td>
              <div className="frame frame-large">Total</div>
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
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {showCreateForm && <AssetForm onClose={closeForm} asset_id="" />}
    </div>
  );
};

export default Assets;
