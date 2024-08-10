// rrd imports
import { Form } from "react-router-dom";

// helper functions
import { formatDateToInputValue, getAllMatchingItems } from "../api/helpers";

// interfaces
import { Transaction } from "./Transactions";
import { Asset } from "./Assets";
import { Category } from "./Categories";
import { useState } from "react";

interface TransactionFormProps {
  assets: Asset[];
  categories: Category[];
  transaction_id: string;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  assets,
  categories,
  transaction_id,
  onClose,
}) => {
  const isEditForm = transaction_id !== "";
  const transaction = getAllMatchingItems(
    "transactions",
    "id",
    transaction_id
  )[0] as Transaction;

  const [transactionType, setTransactionType] = useState<string>(
    isEditForm ? transaction.type : "expense" // Assuming transaction has a 'type' field
  );

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>{isEditForm ? "Editing Transaction" : "Create New Transaction"}</h3>
        <Form method="post" onSubmit={onClose}>
          <input
            type="hidden"
            name="_action"
            value={isEditForm ? "editTransaction" : "createTransaction"}
          />
          {isEditForm && (
            <input type="hidden" name="transaction_id" value={transaction.id} />
          )}
          <div className="form-group">
            <label htmlFor="transactionName">Transaction Name</label>
            <input
              type="text"
              name="name"
              id="transactionName"
              defaultValue={isEditForm ? transaction.name : ""}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="asset_id">Asset</label>
            <select
              name="asset_id"
              id="asset_id"
              defaultValue={isEditForm ? transaction.asset_id : ""}
              required
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.currency})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="category_id">Category</label>
            <select
              name="category_id"
              id="category_id"
              defaultValue={isEditForm ? transaction.category_id : ""}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              defaultValue={
                isEditForm ? formatDateToInputValue(transaction.date) : ""
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input
              type="hidden"
              id="type"
              name="type"
              value={transactionType}
            />
            <div
              className={`btn-rect ${
                transactionType === "expense" ? "btn-rect-red" : ""
              }`}
              onClick={() => setTransactionType("expense")}
            >
              Expense
            </div>
            <div
              className={`btn-rect ${
                transactionType === "income" ? "btn-rect-green" : ""
              }`}
              onClick={() => setTransactionType("income")}
            >
              Income
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              defaultValue={isEditForm ? transaction.amount : ""}
              required
            />
          </div>
          <button type="button" className="btn btn-red" onClick={onClose}>
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

export default TransactionForm;
