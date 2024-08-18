// react imports
import { useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

// helper functions
import {
  DataItem,
  convertCurrency,
  formatCurrency,
  getAllCurrencies,
  spentByCategory,
} from "../../api/helpers";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import CategoryForm from "./CategoryForm";

export interface Category {
  id: string;
  name: string;
  totalBudgeted: number;
  currency: string;
}

interface CategoriesProps {
  categories: Category[];
  currencyRates: DataItem;
}

const Categories: React.FC<CategoriesProps> = ({
  categories,
  currencyRates,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState("");
  const [categoryPeriod, setCategoryPeriod] = useState(["this", "1", "month"]);
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);

  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm("");
  };

  const currencies = getAllCurrencies();
  return (
    <div className="categories">
      <div className="header">
        <h2>Categories</h2>
        <div className="chart-menu">
          <select
            defaultValue={baseCurrency ?? ""}
            onChange={(e) =>
              setBaseCurrency(e.target.value === "" ? null : e.target.value)
            }
          >
            <option key="" value="">
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
              defaultValue={categoryPeriod[0]}
              onChange={(e) => {
                setCategoryPeriod([
                  e.target.value,
                  e.target.value === "this" ? "1" : categoryPeriod[1],
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
        </div>
      </div>

      {categories.map((category) => {
        let periodBudgeted;
        switch (categoryPeriod[2]) {
          case "year":
            periodBudgeted =
              category.totalBudgeted * 12 * Number(categoryPeriod[1]);
            break;
          case "month":
            periodBudgeted = category.totalBudgeted * Number(categoryPeriod[1]);
            break;
          case "week":
            periodBudgeted =
              category.totalBudgeted * (7 / 30) * Number(categoryPeriod[1]);
            break;
          case "day":
            periodBudgeted =
              category.totalBudgeted * (1 / 30) * Number(categoryPeriod[1]);
            break;
          default:
            periodBudgeted = category.totalBudgeted;
        }

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
            <span className="category-name frame color-aqua">
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
              <button
                onClick={() => setShowEditForm(category.id)}
                className="btn"
              >
                <PencilIcon width={20} />
              </button>
              <Form method="post">
                <input type="hidden" name="_action" value="deleteCategory" />
                <input type="hidden" name="category_id" value={category.id} />
                <button type="submit" className="btn btn-red">
                  <TrashIcon width={20} />
                </button>
              </Form>
            </div>
          </div>
        );
      })}

      {showCreateForm && (
        <CategoryForm
          currencies={currencies}
          onClose={closeForm}
          category_id=""
        />
      )}

      {showEditForm !== "" && (
        <CategoryForm
          currencies={currencies}
          onClose={closeForm}
          category_id={showEditForm}
        />
      )}
    </div>
  );
};

export default Categories;
