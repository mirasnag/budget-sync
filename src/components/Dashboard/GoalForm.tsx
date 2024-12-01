// rrd imports
import { Form } from "react-router-dom";

// helper functions
import { getAllCurrencies, getItemById } from "../../api/helpers";

// interfaces
import { EntityType, Goal } from "../../api/dataModels";

interface GoalFormProps {
  goal_id: string;
  onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onClose, goal_id }) => {
  const isEditForm = goal_id !== "";
  const goal = getItemById(EntityType.GOAL, goal_id) as Goal;
  const currencies = getAllCurrencies();

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>{isEditForm ? "Editing Goal" : "Create New Goal"}</h3>
        <Form method="post" onSubmit={onClose}>
          <input
            type="hidden"
            name="_action"
            value={isEditForm ? "editGoal" : "createGoal"}
          />
          {isEditForm && <input type="hidden" name="goal_id" value={goal.id} />}
          <div className="form-group">
            <label htmlFor="goal">Goal Name</label>
            <input
              type="text"
              name="name"
              id="goal"
              defaultValue={isEditForm ? goal.name : ""}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Goal Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              defaultValue={isEditForm ? goal.amount : ""}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              name="currency"
              id="currency"
              defaultValue={isEditForm ? goal.currency : "USD"}
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

export default GoalForm;
