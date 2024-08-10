// react imports
import { useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

// helper functions
import {
  DataItem,
  formatCurrency,
  getAllCurrencies,
  spentByCategory,
} from "../api/helpers";
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

  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm("");
  };
  const currencies = getAllCurrencies();

  return (
    <div className="categories flex-sm">
      <h2>Categories</h2>
      <button className="btn btn-green" onClick={() => setShowCreateForm(true)}>
        <PlusIcon width={20} />
      </button>

      {categories.map((category) => (
        <div key={category.id} className="category flex-sm">
          <span className="category-name">{category.name}</span>
          <div className="category-bar-wrapper">
            <div
              className="category-bar"
              style={{
                width: `${
                  (spentByCategory(category, currencyRates) /
                    category.totalBudgeted) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <span className="category-totalBudgeted">
            {formatCurrency(category.totalBudgeted, category.currency)}
          </span>
          <div className="flex-sm">
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
      ))}

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
