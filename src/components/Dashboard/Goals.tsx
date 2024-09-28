// react imports
import { useState } from "react";

// library imports
import GoalForm from "./GoalForm";
import { formatCurrency } from "../../api/helpers";
import { Form } from "react-router-dom";
import AddButton from "../Buttons/AddButton";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";

export interface Goal {
  id: string;
  name: string;
  amount: number;
  currency: string;
}

interface GoalsProps {
  goals: Goal[];
}

const Goals: React.FC<GoalsProps> = ({ goals }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState("");
  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm("");
  };

  return (
    <div className="goals component">
      <div className="header">
        <h2>Goals</h2>
        <div className="header-menu">
          <AddButton handleClick={() => setShowCreateForm(true)} />
        </div>
      </div>

      {goals.map((goal) => {
        const total = goal.amount;
        const invested = goal.amount * 0.1;
        const remaining = total - invested;
        const currency = goal.currency;

        return (
          <div key={goal.id} className="goal">
            <span className="goal-name frame color-blue">{goal.name}</span>
            <div className="goal-bar-wrapper">
              <div className="goal-bar-back">
                <div
                  className="goal-bar"
                  style={{
                    width: `${(invested / total) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="labels">
                <span>
                  Invested: {formatCurrency(invested, currency)} | Remaining:{" "}
                  {formatCurrency(remaining, currency)}
                </span>
                <span>Total: {formatCurrency(total, currency)}</span>
              </div>
            </div>
            <div className="table-btns">
              <EditButton handleClick={() => setShowEditForm(goal.id)} />
              <Form method="post">
                <input type="hidden" name="_action" value="deleteGoal" />
                <input type="hidden" name="goal_id" value={goal.id} />
                <DeleteButton />
              </Form>
            </div>
          </div>
        );
      })}

      {showCreateForm && <GoalForm onClose={closeForm} goal_id="" />}

      {showEditForm !== "" && (
        <GoalForm onClose={closeForm} goal_id={showEditForm} />
      )}
    </div>
  );
};

export default Goals;
