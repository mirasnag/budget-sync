// rrd imports
import { Form } from "react-router-dom";

// helper functions
import { getAllMatchingItems } from "../api/helpers";

// interfaces
import { Category } from "./Categories";

interface CategoryFormProps {
  currencies: string[];
  category_id: string;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  currencies,
  category_id,
  onClose,
}) => {
  const isEditForm = category_id !== "";
  const category = getAllMatchingItems(
    "categories",
    "id",
    category_id
  )[0] as Category;

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>{isEditForm ? "Editing Category" : "Create New Category"}</h3>
        <Form method="post" onSubmit={onClose}>
          <input
            type="hidden"
            name="_action"
            value={isEditForm ? "editCategory" : "createCategory"}
          />
          {isEditForm && (
            <input type="hidden" name="category_id" value={category.id} />
          )}
          <div className="form-group">
            <label htmlFor="category">Category Name</label>
            <input
              type="text"
              name="name"
              id="category"
              defaultValue={isEditForm ? category.name : ""}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="totalBudgeted">Total Budgeted</label>
            <input
              type="number"
              name="totalBudgeted"
              id="totalBudgeted"
              defaultValue={isEditForm ? category.totalBudgeted : ""}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              name="currency"
              id="currency"
              defaultValue={isEditForm ? category.currency : "USD"}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn">
            {isEditForm ? "Edit" : "Create"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default CategoryForm;
