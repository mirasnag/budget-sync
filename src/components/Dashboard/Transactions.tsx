// react imports
import { useState } from "react";

// rrd imports
import { Form } from "react-router-dom";

// library imports
import {
  ArrowsUpDownIcon,
  FunnelIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { FaCoins, FaShoppingCart } from "react-icons/fa";
import { FaRightLeft } from "react-icons/fa6";

// interfaces
import {
  Asset,
  Category,
  Transaction,
  TransactionType,
} from "../../utils/types";

// UI components
import DeleteButton from "../Editors/DeleteButton";
import FilterEditor, { FilterInstanceType } from "../Transactions/FilterEditor";
import SortEditor, { SortInstanceType } from "../Transactions/SortEditor";
import DatePicker from "../Editors/DatePicker";
import TransactionNodeSelector from "../Editors/TransactionNodeSelector";

// helper functions
import {
  // getTransactionNodes,
  sortFilterTransactions2,
} from "../../utils/transactions.util";
import {
  createEmptyTransaction,
  editTransactionProp,
} from "../../utils/services";

interface TransactionTableProps {
  transactions: Transaction[];
  assets: Asset[];
  categories: Category[];
}

const tableTabs = [
  {
    type: TransactionType.EXPENSE,
    label: "Expense",
    icon: <FaShoppingCart />,
  },
  { type: TransactionType.TRANSFER, label: "Transfer", icon: <FaRightLeft /> },
  { type: TransactionType.INCOME, label: "Income", icon: <FaCoins /> },
];

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  assets,
  categories,
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeSortOrder, setActiveSortOrder] = useState<SortInstanceType[]>(
    []
  );

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilterOrder, setActiveFilterOrder] = useState<
    FilterInstanceType[]
  >([]);

  const tableHeader = ["Name", "Date", "Amount", "Source", "Destination", ""];

  const processedTransactions = sortFilterTransactions2(
    transactions,
    activeFilterOrder,
    activeSortOrder
  );

  const [activeTab, setActiveTab] = useState<TransactionType>(
    TransactionType.EXPENSE
  );
  const filteredTransactions = processedTransactions.filter(
    (transaction) => transaction.type === activeTab
  );

  const addRow = () => {
    createEmptyTransaction(activeTab);
  };

  return (
    <div className="transactions">
      <div className="header">
        <h2>Transactions</h2>
        <div className="btns">
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

      <div className="tab-buttons">
        {tableTabs.map((tab) => (
          <div
            key={tab.type}
            className={`btn ${activeTab === tab.type ? "active" : ""}`}
            onClick={() => setActiveTab(tab.type)}
          >
            {tab.icon}
            {tab.label}
          </div>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            {tableHeader.map((t, index) => (
              <th key={index}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => {
            // const { source, destination } = getTransactionNodes(transaction);

            const amount = transaction.srcAmount ?? transaction.dstAmount ?? "";
            // const currency = source?.currency ?? destination?.currency ?? "USD";

            return (
              <tr key={transaction.id}>
                <td>
                  <div>
                    <input
                      type="text"
                      defaultValue={transaction.name}
                      onInput={(e) => {
                        const newValue = e.currentTarget.value;
                        editTransactionProp(transaction.id, "name", newValue);
                        transaction.name = newValue;
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div>
                    <DatePicker
                      initialValue={transaction.date}
                      onDateChange={(newDate: Date) => {
                        editTransactionProp(transaction.id, "date", newDate);
                        transaction.date = newDate;
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div>
                    <input
                      type="number"
                      defaultValue={amount}
                      onInput={(e) => {
                        const newValue = parseInt(e.currentTarget.value);
                        editTransactionProp(
                          transaction.id,
                          "srcAmount",
                          newValue
                        );
                        editTransactionProp(
                          transaction.id,
                          "dstAmount",
                          newValue
                        );
                        transaction.srcAmount = newValue;
                        transaction.dstAmount = newValue;
                      }}
                    />
                    {/* <span>{currency}</span> */}
                  </div>
                </td>
                <td>
                  <TransactionNodeSelector
                    transaction={transaction}
                    nodeLabel="src"
                  />
                </td>
                <td>
                  <TransactionNodeSelector
                    transaction={transaction}
                    nodeLabel="dst"
                  />
                </td>
                <td>
                  <div>
                    <div className="table-btns">
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
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={tableHeader.length}>
              <div className="flex-center" onClick={() => addRow()}>
                <PlusIcon width={24} />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionTable;
