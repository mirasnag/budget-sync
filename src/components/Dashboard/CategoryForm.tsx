// rrd imports
import { Form } from "react-router-dom";

// helper functions
import { getItemById } from "../../utils/services";
import { getAllCurrencies } from "../../utils/currency.util";

// interfaces
import { Category, EntityType } from "../../utils/types";

interface CategoryFormProps {
  category_id: string;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category_id,
  onClose,
}) => {
  const isEditForm = category_id !== "";
  const category = getItemById(EntityType.CATEGORY, category_id) as Category;
  const currencies = getAllCurrencies();

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
            <label htmlFor="amount">Monthly Budgeted Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              defaultValue={isEditForm ? category.amount : ""}
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
          <button type="button" className="btn btn-medium" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-medium">
            {isEditForm ? "Edit" : "Create"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default CategoryForm;
