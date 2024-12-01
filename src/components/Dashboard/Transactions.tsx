// react imports
import { useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

// library imports
import {
  ArrowLongRightIcon,
  ArrowsUpDownIcon,
  FunnelIcon,
} from "@heroicons/react/20/solid";
import { FaTags, FaWallet } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";

// interfaces
import {
  Asset,
  Category,
  Transaction,
  TransactionType,
} from "../../utils/types";

// UI components
import TransactionForm from "./TransactionForm";
import AddButton from "../Buttons/AddButton";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import FilterEditor from "../Transactions/FilterEditor";
import SortEditor from "../Transactions/SortEditor";

// helper functions
import {
  getTransactionNodes,
  sortFilterTransactions2,
} from "../../utils/transactions.util";
import { formatCurrency, formatDate } from "../../utils/formatting";

export interface TransactionTableProps {
  transactions: Transaction[];
  assets: Asset[];
  categories: Category[];
}

export interface SortInstanceType {
  id: string;
  option: string;
  isAscending: boolean;
}

export interface FilterInstanceType {
  id: string;
  option: string[]; // length = 2
  value: string | null;
}

export const filterOptions = {
  Name: ["Contains", "Is", "Starts With"],
  // Asset: ["Is", "Is not"],
  // Category: ["Is", "Is not"],
  Date: ["Is", "Is before", "Is after"],
  Amount: ["Equal", "More", "Less", "At Least", "At Most"],
  Type: ["Is", "Is not"],
};

export type FilterOptionKey = keyof typeof filterOptions;

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  assets,
  categories,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState("");
  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm("");
  };

  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeSortOrder, setActiveSortOrder] = useState<SortInstanceType[]>(
    []
  );

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilterOrder, setActiveFilterOrder] = useState<
    FilterInstanceType[]
  >([]);

  const tableHeader = ["Name", "Date", "Amount", "Details", ""];

  const processedTransactions = sortFilterTransactions2(
    transactions,
    activeFilterOrder,
    activeSortOrder
  );

  return (
    <div className="transactions">
      <div className="header">
        <h2>Transactions</h2>
        <div className="btns">
          <AddButton
            handleClick={() => {
              if (assets.length === 0 && categories.length === 0) {
                alert(
                  "No assets and categories available. Please add them first."
                );
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
          />

          <button
            className={
              showSortMenu ? "btn btn-medium color-yellow" : "btn btn-medium"
            }
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowFilterMenu(false);
            }}
          >
            <ArrowsUpDownIcon width={20} />
          </button>

          <button
            className={
              showFilterMenu ? "btn btn-medium color-yellow" : "btn btn-medium"
            }
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowSortMenu(false);
            }}
          >
            <FunnelIcon width={20} />
          </button>

          {showSortMenu && (
            <SortEditor
              sortOrder={activeSortOrder}
              setSortOrder={setActiveSortOrder}
            />
          )}

          {showFilterMenu && (
            <FilterEditor
              assets={assets}
              categories={categories}
              filterOrder={activeFilterOrder}
              setFilterOrder={setActiveFilterOrder}
            />
          )}
        </div>
      </div>

      <table>
        <thead>
          <tr style={{ borderBottom: "1px solid #888" }}>
            {tableHeader.map((t, index) => (
              <th key={index}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processedTransactions.map((transaction, index) => {
            const { source, destination } = getTransactionNodes(transaction);
            const srcName = source ? source.name : transaction.src.id;
            const dstName = destination ? destination.name : transaction.dst.id;

            const formattedAmount = formatCurrency(
              transaction?.src.amount ?? transaction?.dst.amount ?? "0",
              source?.currency ?? destination?.currency ?? "USD"
            );

            return (
              <tr key={index}>
                <td>{transaction.name}</td>
                <td>{formatDate(transaction.date)}</td>
                <td>
                  {transaction.type === TransactionType.INCOME && (
                    <div className="flex-center frame color-green">
                      {formattedAmount}
                    </div>
                  )}
                  {transaction.type === TransactionType.EXPENSE && (
                    <div className="flex-center frame color-red">
                      {formattedAmount}
                    </div>
                  )}
                  {transaction.type === TransactionType.TRANSFER && (
                    <div className="flex-center frame color-yellow">
                      {formattedAmount}
                    </div>
                  )}
                </td>
                <td>
                  {transaction.type === TransactionType.EXPENSE && (
                    <div className="transaction-details">
                      <div className="flex-center frame color-blue">
                        <FaWallet width={15} />
                        {srcName}
                      </div>
                      <ArrowLongRightIcon width={20} />
                      <div className="flex-center frame color-blue">
                        <FaTags width={15} />
                        {dstName}
                      </div>
                    </div>
                  )}
                  {transaction.type === TransactionType.INCOME && (
                    <div className="transaction-details">
                      <div className="flex-center frame color-blue">
                        <FaSackDollar width={20} />
                        {srcName}
                      </div>
                      <ArrowLongRightIcon width={20} />
                      <div className="flex-center frame color-blue">
                        <FaWallet width={15} />
                        {dstName}
                      </div>
                    </div>
                  )}
                  {transaction.type === TransactionType.TRANSFER && (
                    <div className="transaction-details">
                      <div className="flex-center frame color-blue">
                        <FaWallet width={15} />
                        {srcName}
                      </div>
                      <ArrowLongRightIcon width={20} />
                      <div className="flex-center frame color-blue">
                        <FaWallet width={15} />
                        {dstName}
                      </div>
                    </div>
                  )}
                </td>
                <td>
                  <div className="table-btns">
                    <EditButton
                      handleClick={() => setShowEditForm(transaction.id)}
                    />
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
                      <DeleteButton />
                    </Form>
                  </div>
                </td>
              </tr>
            );
          })}
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
