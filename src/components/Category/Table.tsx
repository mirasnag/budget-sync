// components
import { Period } from "../Controls/PeriodSelector";
import CurrencySelector2 from "../Currency/CurrencySelector2";
import DeleteButton from "../Controls/DeleteButton";
import AddButton from "../Controls/AddButton";

// helper functions
import { convertCurrency } from "../../utils/currency.util";
import { formatCurrency } from "../../utils/formatting";
import { Category, CollectionType, CurrencyRates } from "../../utils/types";
import { createEmptyCategory, deleteItem, editItem } from "../../utils/api";
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

  const addCategory = async () => {
    const newCategory = await createEmptyCategory();
    categoryDispatch({
      type: "ADD",
      payload: newCategory,
    });
  };

  const deleteCategory = async (id: string) => {
    await deleteItem(CollectionType.CATEGORIES, id);
    categoryDispatch({
      type: "DELETE",
      payload: id,
    });
  };

  const editCategory = <T extends keyof Category>(
    id: string,
    prop: T,
    value: Category[T]
  ) => {
    editItem<Category>(CollectionType.CATEGORIES, id, prop, value);
    categoryDispatch({
      type: "EDIT",
      payload: {
        id,
        prop,
        value,
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
        {categories &&
          categories.map((category, index) => {
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
                    onBlur={(e) => {
                      const newValue = e.currentTarget.value;
                      editCategory(category.id, "name", newValue);
                    }}
                  />
                </td>
                <td>{formatCurrency(periodBudgeted, currency)}</td>
                <td>{formatCurrency(spent, currency)}</td>
                <td>{formatCurrency(remaining, currency)}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={category.amount}
                    onBlur={(e) => {
                      const newValue = parseFloat(e.currentTarget.value);
                      editCategory(category.id, "amount", newValue);
                    }}
                  />
                </td>
                <td>
                  <CurrencySelector2
                    initialValue={category.currency ?? null}
                    setValue={(newValue) =>
                      editCategory(category.id, "currency", newValue)
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
