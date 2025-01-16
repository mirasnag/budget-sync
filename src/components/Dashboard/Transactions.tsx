// react imports
import { useState } from "react";

// library imports
import { ArrowsUpDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import { FaCoins, FaShoppingCart } from "react-icons/fa";
import { FaRightLeft } from "react-icons/fa6";

// interfaces
import { TransactionType } from "../../utils/types";

// UI components
import DeleteButton from "../Editors/DeleteButton";
import FilterEditor, { FilterInstanceType } from "../Transactions/FilterEditor";
import SortEditor, { SortInstanceType } from "../Transactions/SortEditor";
import DatePicker from "../Editors/DatePicker";
import TransactionNodeSelector from "../Editors/TransactionNodeSelector";
import AddButton from "../Editors/AddButton";

// helper functions
import {
  // getTransactionNodes,
  sortFilterTransactions2,
} from "../../utils/transactions.util";
import { useClickHandler } from "../../utils/hooks";

import { useTransactionContext } from "../../store/transaction-context";
import { useAssetContext } from "../../store/asset-context";
import { useCategoryContext } from "../../store/category-context";
import { createEmptyTransaction } from "../../utils/services";

interface TransactionTableProps {}

const tableTabs = [
  {
    type: TransactionType.EXPENSE,
    label: "Expense",
    icon: <FaShoppingCart />,
  },
  { type: TransactionType.TRANSFER, label: "Transfer", icon: <FaRightLeft /> },
  { type: TransactionType.INCOME, label: "Income", icon: <FaCoins /> },
];

const TransactionTable: React.FC<TransactionTableProps> = () => {
  const { data: transactions, dispatch: transactionDispatch } =
    useTransactionContext();
  const { data: assets } = useAssetContext();
  const { data: categories } = useCategoryContext();

  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeSortOrder, setActiveSortOrder] = useState<SortInstanceType[]>(
    []
  );
  const sortClickRef = useClickHandler<HTMLButtonElement>({
    onInsideClick: () => {
      setShowSortMenu((prev) => !prev);
      setShowFilterMenu(false);
    },
    onOutsideClick: () => {
      setShowSortMenu(false);
    },
  });

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilterOrder, setActiveFilterOrder] = useState<
    FilterInstanceType[]
  >([]);
  const filterClickRef = useClickHandler<HTMLButtonElement>({
    onInsideClick: () => {
      setShowFilterMenu((prev) => !prev);
      setShowSortMenu(false);
    },
    onOutsideClick: () => {
      setShowFilterMenu(false);
    },
  });

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

  const addTransaction = () => {
    transactionDispatch({
      type: "ADD",
      payload: createEmptyTransaction(activeTab),
    });
  };

  const deleteTransaction = (id: string) => {
    transactionDispatch({
      type: "DELETE",
      payload: id,
    });
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
            ref={sortClickRef}
          >
            <ArrowsUpDownIcon width={20} />
          </button>

          <button
            className={
              showFilterMenu ? "btn btn-medium color-yellow" : "btn btn-medium"
            }
            ref={filterClickRef}
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
                        transactionDispatch({
                          type: "EDIT",
                          payload: {
                            id: transaction.id,
                            prop: "name",
                            value: newValue,
                          },
                        });
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div>
                    <DatePicker
                      initialValue={transaction.date ?? null}
                      onDateChange={(newDate: Date) => {
                        transactionDispatch({
                          type: "EDIT",
                          payload: {
                            id: transaction.id,
                            prop: "date",
                            value: newDate,
                          },
                        });
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
                        transactionDispatch({
                          type: "EDIT",
                          payload: {
                            id: transaction.id,
                            prop: "srcAmount",
                            value: newValue,
                          },
                        });
                        transactionDispatch({
                          type: "EDIT",
                          payload: {
                            id: transaction.id,
                            prop: "dstAmount",
                            value: newValue,
                          },
                        });
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
                      <DeleteButton
                        handleClick={() => deleteTransaction(transaction.id)}
                      />
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
              <div className="flex-center">
                <AddButton handleClick={() => addTransaction()} />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionTable;
