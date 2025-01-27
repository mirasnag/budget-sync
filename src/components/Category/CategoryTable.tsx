// components
import { Period } from "../Buttons/PeriodSelector";
import CurrencySelector2 from "../Currency/CurrencySelector2";
import DeleteButton from "../Buttons/DeleteButton";
import AddButton from "../Buttons/AddButton";

// helper functions
import { convertCurrency } from "../../utils/currency.util";
import { formatCurrency } from "../../utils/formatting";
import { CurrencyRates } from "../../utils/types";
import { createEmptyCategory } from "../../utils/services";
import { spentByCategory } from "../../utils/entities.util";

// context
import { useCategoryContext } from "../../store/category-context";
import { useTransactionContext } from "../../store/transaction-context";

interface CategoryTableProps {
  baseCurrency: string | null;
  period: Period;
  currencyRates: CurrencyRates;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  currencyRates,
  baseCurrency,
  period,
}) => {
  const { data: categories, dispatch: categoryDispatch } = useCategoryContext();
  const { data: transactions } = useTransactionContext();

  const tableHeader: string[] = [
    "Name",
    "Total",
    "Spent",
    "Remaining",
    "Monthly Budget",
    "Currency",
    "",
  ];

  let periodMonths;

  if (period.type === "absolute") {
    const startDate = new Date(period.start);
    const endDate = new Date(period.end);
    periodMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
  } else {
    switch (period.unit) {
      case "Year":
        periodMonths = 12 * Number(period.option == "This" ? 1 : period.value);
        break;
      case "Month":
        periodMonths = Number(period.option == "This" ? 1 : period.value);
        break;
      default:
        periodMonths = 1;
    }
  }

  const addCategory = () => {
    categoryDispatch({
      type: "ADD",
      payload: createEmptyCategory(),
    });
  };

  const deleteCategory = (id: string) => {
    categoryDispatch({
      type: "DELETE",
      payload: id,
    });
  };

  const handleCurrencyChange = (category_id: string, newValue: string) => {
    categoryDispatch({
      type: "EDIT",
      payload: {
        id: category_id,
        prop: "currency",
        value: newValue,
      },
    });
  };

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
        {categories.map((category, index) => {
          const periodBudgeted = (category.amount ?? 0) * periodMonths;
          const total = baseCurrency
            ? convertCurrency(
                currencyRates,
                category.currency,
                baseCurrency,
                periodBudgeted
              )
            : periodBudgeted;
          const spent = baseCurrency
            ? convertCurrency(
                currencyRates,
                category.currency,
                baseCurrency,
                spentByCategory(category, currencyRates, period, transactions)
              )
            : spentByCategory(category, currencyRates, period, transactions);

          const remaining = total - spent;
          const currency = baseCurrency ?? category.currency;

          return (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  defaultValue={category.name}
                  onInput={(e) => {
                    const newValue = e.currentTarget.value;
                    categoryDispatch({
                      type: "EDIT",
                      payload: {
                        id: category.id,
                        prop: "name",
                        value: newValue,
                      },
                    });
                  }}
                />
              </td>
              <td>{formatCurrency(periodBudgeted, currency)}</td>
              <td>{formatCurrency(spent, currency)}</td>
              <td>{formatCurrency(remaining, currency)}</td>
              <td>
                <input
                  type="number"
                  value={category.amount}
                  onInput={(e) => {
                    const newValue = parseFloat(e.currentTarget.value);
                    categoryDispatch({
                      type: "EDIT",
                      payload: {
                        id: category.id,
                        prop: "amount",
                        value: newValue,
                      },
                    });
                  }}
                />
              </td>
              <td>
                <CurrencySelector2
                  initialValue={category.currency ?? null}
                  setValue={(newValue) =>
                    handleCurrencyChange(category.id, newValue)
                  }
                />{" "}
              </td>
              <td>
                <div className="table-btns">
                  <DeleteButton
                    handleClick={() => deleteCategory(category.id)}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={tableHeader.length}>
            <div className="flex-center">
              <AddButton handleClick={() => addCategory()} />
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default CategoryTable;
