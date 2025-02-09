import { useTransactionContext } from "../../store/transaction-context";
import { deleteItem } from "../../utils/api";
import { CollectionType, Transaction } from "../../utils/types";
import DatePicker from "../Controls/DatePicker";
import DeleteButton from "../Controls/DeleteButton";
import TransactionNodeSelector from "./TransactionNodeSelector";

interface TransactionRowProp {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProp> = ({ transaction }) => {
  const { dispatch: transactionDispatch } = useTransactionContext();

  // const { source, destination } = getTransactionNodes(transaction);
  const amount = transaction.srcAmount ?? transaction.dstAmount ?? "";
  // const currency = source?.currency ?? destination?.currency ?? "USD";

  const deleteTransaction = async (id: string) => {
    await deleteItem(CollectionType.TRANSACTIONS, id);
    transactionDispatch({
      type: "DELETE",
      payload: id,
    });
  };

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
            initialValue={
              transaction.date_utc ? new Date(transaction.date_utc) : null
            }
            onDateChange={(newDate: Date) => {
              transactionDispatch({
                type: "EDIT",
                payload: {
                  id: transaction.id,
                  prop: "date_utc",
                  value: newDate.toISOString(),
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
              const newValue = parseFloat(e.currentTarget.value);
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
        <TransactionNodeSelector transaction={transaction} nodeLabel="src" />
      </td>
      <td>
        <TransactionNodeSelector transaction={transaction} nodeLabel="dst" />
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
