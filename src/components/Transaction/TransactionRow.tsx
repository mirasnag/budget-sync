import { useTransactionContext } from "../../store/transaction-context";
import { Transaction } from "../../utils/types";
import DatePicker from "../Buttons/DatePicker";
import DeleteButton from "../Buttons/DeleteButton";
import TransactionNodeSelector from "./TransactionNodeSelector";

interface TransactionRowProp {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProp> = ({ transaction }) => {
  const { dispatch: transactionDispatch } = useTransactionContext();

  // const { source, destination } = getTransactionNodes(transaction);
  const amount = transaction.srcAmount ?? transaction.dstAmount ?? "";
  // const currency = source?.currency ?? destination?.currency ?? "USD";

  const deleteTransaction = (id: string) => {
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
