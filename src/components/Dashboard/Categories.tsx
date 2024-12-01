// react imports
import { useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

// helper functions
import { formatCurrency } from "../../utils/formatting";
import { convertCurrency } from "../../utils/currency.util";
import { spentByCategory } from "../../utils/entities.util";

// interfaces
import { Category, CurrencyRates } from "../../utils/types";

// components
import CategoryForm from "./CategoryForm";
import AddButton from "../Buttons/AddButton";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import PeriodSelector, { Period } from "../Buttons/PeriodSelector";
import CurrencySelector from "../Buttons/CurrencySelector";

interface CategoriesProps {
  categories: Category[];
  currencyRates: CurrencyRates;
}

const Categories: React.FC<CategoriesProps> = ({
  categories,
  currencyRates,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState("");
  const [categoryPeriod, setCategoryPeriod] = useState<Period>({
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

  let periodMonths;

  if (categoryPeriod.type === "absolute") {
    const startDate = new Date(categoryPeriod.start);
    const endDate = new Date(categoryPeriod.end);
    periodMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
  } else {
    switch (categoryPeriod.unit) {
      case "Year":
        periodMonths = 12 * Number(categoryPeriod.value);
        break;
      case "Month":
        periodMonths = Number(categoryPeriod.value ?? 1);
        break;
      default:
        periodMonths = 1;
    }
  }

  return (
    <div className="categories component">
      <div className="header">
        <h2>Categories</h2>
        <div className="header-menu">
          <CurrencySelector
            baseCurrency={baseCurrency}
            setBaseCurrency={setBaseCurrency}
          />
          <AddButton handleClick={() => setShowCreateForm(true)} />
          <PeriodSelector
            period={categoryPeriod}
            setPeriod={setCategoryPeriod}
          />
        </div>
      </div>

      {categories.map((category) => {
        const periodBudgeted = category.totalBudgeted * periodMonths;
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
              spentByCategory(category, currencyRates, categoryPeriod)
            )
          : spentByCategory(category, currencyRates, categoryPeriod);

        const remaining = total - spent;
        const currency = baseCurrency ?? category.currency;

        return (
          <div key={category.id} className="category">
            <span className="category-name frame color-blue">
              {category.name}
            </span>
            <div className="category-bar-wrapper">
              <div className="category-bar-back">
                <div
                  className="category-bar"
                  style={{
                    width: `${(spent / total) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="labels">
                <span>
                  Spent: {formatCurrency(spent, currency)} | Remaining:{" "}
                  {formatCurrency(remaining, currency)}
                </span>
                <span>Total: {formatCurrency(total, currency)}</span>
              </div>
            </div>
            <div className="table-btns">
              <EditButton handleClick={() => setShowEditForm(category.id)} />
              <Form method="post">
                <input type="hidden" name="_action" value="deleteCategory" />
                <input type="hidden" name="category_id" value={category.id} />
                <DeleteButton />
              </Form>
            </div>
          </div>
        );
      })}

      {showCreateForm && <CategoryForm onClose={closeForm} category_id="" />}

      {showEditForm !== "" && (
        <CategoryForm onClose={closeForm} category_id={showEditForm} />
      )}
    </div>
  );
};

export default Categories;
