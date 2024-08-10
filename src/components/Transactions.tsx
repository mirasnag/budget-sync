// react imports
import { useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

// library imports
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

// interfaces
import { Asset } from "./Assets";
import { Category } from "./Categories";

// components
import TransactionForm from "./TransactionForm";

// helper functions
import {
  formatCurrency,
  formatDate,
  getAllMatchingItems,
} from "../api/helpers";

export interface Transaction {
  id: string;
  name: string;
  asset_id: string;
  category_id: string;
  amount: number;
  currency: string;
  date: Date;
  createdAt: Date;
  type: string;
}

export interface TransactionTableProps {
  transactions: Transaction[];
  assets: Asset[];
  categories: Category[];
  isRecent?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  assets,
  categories,
  isRecent = true,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState("");

  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm("");
  };

  const tableHeader: string[] = [
    "Name",
    "Asset",
    "Category",
    "Date",
    "Amount",
    "",
  ];

  return (
    <div className="transactions flex-sm">
      <h2>{isRecent && "Recent"} Transactions</h2>
      <button
        className="btn btn-green"
        onClick={() => {
          if (assets.length === 0 && categories.length === 0) {
            alert("No assets and categories available. Please add them first.");
            return;
          }
          if (assets.length === 0) {
            alert("No assets available. Please add an asset first.");
            return;
          }
          if (categories.length === 0) {
            alert("No categories available. Please add a category first.");
            return;
          }
          setShowCreateForm(true);
        }}
      >
        <PlusIcon width={20} />
      </button>
      <table>
        <thead>
          <tr>
            {tableHeader.map((t, index) => (
              <th key={index}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.name}</td>
              <td>
                <div className="frame color-aqua">
                  {getAllMatchingItems("assets", "id", transaction.asset_id)[0]
                    ?.name ?? ""}
                </div>
              </td>
              <td>
                <div className="frame color-aqua">
                  {getAllMatchingItems(
                    "categories",
                    "id",
                    transaction.category_id
                  )[0]?.name ?? ""}
                </div>
              </td>
              <td>{formatDate(transaction.date)}</td>
              <td>
                <div
                  className={
                    transaction.type === "income"
                      ? "frame color-green"
                      : "frame color-red"
                  }
                >
                  {formatCurrency(transaction.amount, transaction.currency)}
                </div>
              </td>
              <td>
                <div className="flex-sm">
                  <button
                    onClick={() => setShowEditForm(transaction.id)}
                    className="btn"
                  >
                    <PencilIcon width={20} />
                  </button>
                  <Form method="post">
                    <input
                      type="hidden"
                      name="_action"
                      value="deleteTransaction"
                    />
                    <input
                      type="hidden"
                      name="transaction_id"
                      value={transaction.id}
                    />
                    <button type="submit" className="btn btn-red">
                      <TrashIcon width={20} />
                    </button>
                  </Form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateForm && (
        <TransactionForm
          assets={assets}
          categories={categories}
          transaction_id={""}
          onClose={closeForm}
        />
      )}

      {showEditForm !== "" && (
        <TransactionForm
          assets={assets}
          categories={categories}
          transaction_id={showEditForm}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default TransactionTable;
