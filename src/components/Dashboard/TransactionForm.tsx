// rrd imports
import { Form } from "react-router-dom";

// react imports
import { useState } from "react";

// helper functions
import { getTransaction } from "../../utils/services";
import { formatDateToInputValue } from "../../utils/formatting";

// interfaces
import { Asset, Category, TransactionType } from "../../utils/types";

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
  const transaction = getTransaction(transaction_id);

  const [transactionType, setTransactionType] = useState<TransactionType>(
    isEditForm ? transaction.type : TransactionType.EXPENSE
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
          <input
            type="hidden"
            name="transaction_id"
            value={isEditForm ? transaction.id : ""}
          />

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
            <label htmlFor="type">Type</label>
            <input
              type="hidden"
              id="type"
              name="type"
              value={transactionType}
            />
            <div
              className={`btn-rect ${
                transactionType === TransactionType.EXPENSE
                  ? "btn-rect-red"
                  : ""
              }`}
              onClick={() => setTransactionType(TransactionType.EXPENSE)}
            >
              Expense
            </div>
            <div
              className={`btn-rect ${
                transactionType === TransactionType.TRANSFER
                  ? "btn-rect-yellow"
                  : ""
              }`}
              onClick={() => setTransactionType(TransactionType.TRANSFER)}
            >
              Transfer
            </div>
            <div
              className={`btn-rect ${
                transactionType === TransactionType.INCOME
                  ? "btn-rect-green"
                  : ""
              }`}
              onClick={() => setTransactionType(TransactionType.INCOME)}
            >
              Income
            </div>
          </div>
          {transactionType === TransactionType.EXPENSE && (
            <>
              <div className="form-group">
                <label htmlFor="src">Asset</label>
                <select
                  name="src"
                  id="src"
                  defaultValue={isEditForm ? transaction.src.id : ""}
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
                <label htmlFor="dst">Category of Expense</label>
                <select
                  name="dst"
                  id="dst"
                  defaultValue={isEditForm ? transaction.dst.id : ""}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {transactionType === TransactionType.INCOME && (
            <>
              <div className="form-group">
                <label htmlFor="src">Source of Income</label>
                <input
                  type="text"
                  name="src"
                  id="src"
                  defaultValue={""}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dst">Asset</label>
                <select
                  name="dst"
                  id="dst"
                  defaultValue={isEditForm ? transaction.dst.id : ""}
                  required
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.currency})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {transactionType === TransactionType.TRANSFER && (
            <>
              <div className="form-group">
                <label htmlFor="src">Transfer From</label>
                <select
                  name="src"
                  id="src"
                  defaultValue={isEditForm ? transaction.src.id : ""}
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
                <label htmlFor="dst">Asset</label>
                <select
                  name="dst"
                  id="dst"
                  defaultValue={isEditForm ? transaction.dst.id : ""}
                  required
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.currency})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
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
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              id="amount"
              defaultValue={isEditForm ? transaction.src.amount : ""}
              required
            />
          </div>
          <button
            type="button"
            className="btn btn-medium btn-red"
            onClick={onClose}
          >
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

export default TransactionForm;
