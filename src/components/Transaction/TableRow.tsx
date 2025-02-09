import { useTransactionContext } from "../../store/transaction-context";
import { deleteItem, editItem } from "../../utils/api";
import { CollectionType, Transaction } from "../../utils/types";
import DatePicker from "../Controls/DatePicker";
import DeleteButton from "../Controls/DeleteButton";
import TransactionNodeSelector from "./NodeSelector";

interface TransactionRowProp {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProp> = ({ transaction }) => {
  const { dispatch: transactionDispatch } = useTransactionContext();

  // const { source, destination } = getTransactionNodes(transaction);
  // const currency = source?.currency ?? destination?.currency ?? "USD";
  const amount = transaction.srcAmount ?? transaction.dstAmount ?? "";

  const deleteTransaction = async (id: string) => {
    await deleteItem(CollectionType.TRANSACTIONS, id);
    transactionDispatch({
      type: "DELETE",
      payload: id,
    });
  };

  const editTransaction = <T extends keyof Transaction>(
    prop: T,
    value: Transaction[T]
  ) => {
    editItem<Transaction>(
      CollectionType.TRANSACTIONS,
      transaction.id,
      prop,
      value
    );
    transactionDispatch({
      type: "EDIT",
      payload: {
        id: transaction.id,
        prop,
        value,
      },
    });
  };

  return (
    <tr key={transaction.id}>
      <td>
        <div>
          <input
            type="text"
            defaultValue={transaction.name}
            onBlur={(e) => {
              const newValue = e.currentTarget.value;
              editTransaction("name", newValue);
            }}
          />
        </div>
      </td>
      <td>
        <div>
          <DatePicker
            initialValue={
              transaction.date_utc ? new Date(transaction.date_utc) : null
            }
            onDateChange={(newDate: Date) => {
              editTransaction("date_utc", newDate.toISOString());
            }}
          />
        </div>
      </td>
      <td>
        <div>
          <input
            type="number"
            defaultValue={amount}
            onBlur={(e) => {
              const newValue = parseFloat(e.currentTarget.value);
              editTransaction("srcAmount", newValue);
              editTransaction("dstAmount", newValue);
            }}
          />
          {/* <span>{currency}</span> */}
        </div>
      </td>
      <td>
        <TransactionNodeSelector
          transaction={transaction}
          nodeLabel="src"
          onNodeChange={(newNodeId: string) =>
            editTransaction("src", newNodeId)
          }
        />
      </td>
      <td>
        <TransactionNodeSelector
          transaction={transaction}
          nodeLabel="dst"
          onNodeChange={(newNodeId: string) =>
            editTransaction("dst", newNodeId)
          }
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
};

export default TransactionRow;
