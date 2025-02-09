// react imports
import { useState } from "react";

// library imports
import { FaCoins, FaShoppingCart } from "react-icons/fa";
import { FaRightLeft } from "react-icons/fa6";

// components
import TransactionRow from "./TransactionRow";
import AddButton from "../Controls/AddButton";

// utils
import { Transaction, TransactionType } from "../../utils/types";
import { createEmptyTransaction } from "../../utils/api";

// context
import { useTransactionContext } from "../../store/transaction-context";

const tableTabs = [
  {
    type: TransactionType.EXPENSE,
    label: "Expense",
    icon: <FaShoppingCart />,
  },
  { type: TransactionType.TRANSFER, label: "Transfer", icon: <FaRightLeft /> },
  { type: TransactionType.INCOME, label: "Income", icon: <FaCoins /> },
];

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
}) => {
  const { dispatch: transactionDispatch } = useTransactionContext();

  const tableHeader = ["Name", "Date", "Amount", "Source", "Destination", ""];

  const [activeTab, setActiveTab] = useState<TransactionType>(
    TransactionType.EXPENSE
  );
  const filteredTransactions = transactions
    ? transactions.filter((transaction) => transaction.type === activeTab)
    : [];

  const addTransaction = async () => {
    const newTransaction = await createEmptyTransaction(activeTab);
    transactionDispatch({
      type: "ADD",
      payload: newTransaction,
    });
  };

  return (
    <>
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
          {filteredTransactions &&
            filteredTransactions.map((transaction, id) => {
              return <TransactionRow key={id} transaction={transaction} />;
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
    </>
  );
};

export default TransactionTable;
