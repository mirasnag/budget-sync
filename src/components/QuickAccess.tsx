// react imports
import { useRef, useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

const QuickAccess = () => {
  const [showForm, setShowForm] = useState("");
  const transactionFormRef = useRef<HTMLFormElement>(null);
  const categoryFormRef = useRef<HTMLFormElement>(null);
  const assetFormRef = useRef<HTMLFormElement>(null);

  return (
    <div className="quick_access">
      <h2>Quick Access</h2>
      <div className="btns flex-sm">
        <button className="btn" onClick={() => setShowForm("Asset")}>
          New Asset
        </button>
        <button className="btn" onClick={() => setShowForm("Category")}>
          New Category
        </button>
        <button className="btn" onClick={() => setShowForm("Transaction")}>
          New Transaction
        </button>
      </div>

      {showForm === "Asset" && (
        <div className="popup">
          <div className="popup-content">
            <h3>Create New Asset</h3>
            <Form method="post" ref={assetFormRef}>
              <input type="hidden" name="_action" value="createAsset" />
              <div className="form-group">
                <label htmlFor="assetName">Asset Name</label>
                <input type="text" name="name" id="assetName" required />
              </div>
              <div className="form-group">
                <label htmlFor="initBalance">Initial Balance</label>
                <input
                  type="text"
                  name="initBalance"
                  id="initBalance"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <input type="string" name="currency" id="currency" required />
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => setShowForm("")}
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Create
              </button>
            </Form>
          </div>
        </div>
      )}

      {showForm === "Category" && (
        <div className="popup">
          <div className="popup-content">
            <h3>Create New Category</h3>
            <Form method="post" ref={categoryFormRef}>
              <input type="hidden" name="_action" value="createCategory" />
              <div className="form-group">
                <label htmlFor="category">Category Name</label>
                <input type="text" name="name" id="category" required />
              </div>
              <div className="form-group">
                <label htmlFor="totalBudgeted">Total Budgeted</label>
                <input
                  type="text"
                  name="totalBudgeted"
                  id="totalBudgeted"
                  required
                />
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => setShowForm("")}
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Create
              </button>
            </Form>
          </div>
        </div>
      )}

      {showForm === "Transaction" && (
        <div className="popup">
          <div className="popup-content">
            <h3>Create New Transaction</h3>
            <Form method="post" ref={transactionFormRef}>
              <input type="hidden" name="_action" value="createTransaction" />
              <div className="form-group">
                <label htmlFor="transactionName">Transaction Name</label>
                <input type="text" name="name" id="transactionName" required />
              </div>
              <div className="form-group">
                <label htmlFor="asset_id">Asset</label>
                <input type="text" name="asset_id" id="asset_id" required />
              </div>
              <div className="form-group">
                <label htmlFor="category_id">Category</label>
                <input
                  type="text"
                  name="category_id"
                  id="category_id"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input type="text" name="amount" id="amount" required />
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => setShowForm("")}
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Create
              </button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAccess;
