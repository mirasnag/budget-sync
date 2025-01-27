import { useAssetContext } from "../../store/asset-context";
import { useTransactionContext } from "../../store/transaction-context";
import { getAssetDetails, getBalanceOfAsset } from "../../utils/entities.util";
import { Period } from "../Buttons/PeriodSelector";
import { convertCurrency } from "../../utils/currency.util";
import { CurrencyRates } from "../../utils/types";
import { formatCurrency } from "../../utils/formatting";
import CurrencySelector2 from "../Currency/CurrencySelector2";
import DeleteButton from "../Buttons/DeleteButton";
import AddButton from "../Buttons/AddButton";
import { createEmptyAsset } from "../../utils/services";

interface AssetTableProps {
  baseCurrency: string | null;
  period: Period;
  currencyRates: CurrencyRates;
}

const AssetTable: React.FC<AssetTableProps> = ({
  currencyRates,
  baseCurrency,
  period,
}) => {
  const { data: assets, dispatch: assetDispatch } = useAssetContext();
  const { data: transactions } = useTransactionContext();

  const tableHeader: string[] = [
    "Name",
    "Balance",
    "Income",
    "Expenses",
    "Currency",
    "",
  ];

  const addAsset = () => {
    assetDispatch({
      type: "ADD",
      payload: createEmptyAsset(),
    });
  };

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

  // let totalBalance = 0;
  // let totalIncome = 0;
  // let totalExpense = 0;

  return (
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
          let balance = getBalanceOfAsset(asset, transactions);
          let { income, expense } = getAssetDetails(
            asset,
            period,
            transactions
          );

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

            // totalBalance += +balance;
            // totalExpense += +expense;
            // totalIncome += +income;
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
              <td>{formatCurrency(balance, baseCurrency ?? asset.currency)}</td>
              <td>{formatCurrency(income, baseCurrency ?? asset.currency)}</td>
              <td>{formatCurrency(expense, baseCurrency ?? asset.currency)}</td>
              <td>
                <CurrencySelector2
                  initialValue={asset.currency ?? null}
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

        {/* <tr key="summary">
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
        </tr> */}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={tableHeader.length}>
            <div className="flex-center">
              <AddButton handleClick={() => addAsset()} />
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default AssetTable;
