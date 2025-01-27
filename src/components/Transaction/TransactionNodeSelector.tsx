// Helper functions
import {
  getTransactionNodeTypes,
  getTransactionNodes,
} from "../../utils/transactions.util";

// Types
import { Transaction, typeToCollectionMap } from "../../utils/types";
import { useTransactionContext } from "../../store/transaction-context";
import { getContextData } from "../../store/contextProviders";
import Selector from "../Controls/Selector";

interface TransactionNodeSelectorProps {
  transaction: Transaction;
  nodeLabel: "src" | "dst";
}

const TransactionNodeSelector: React.FC<TransactionNodeSelectorProps> = ({
  transaction,
  nodeLabel,
}) => {
  const { dispatch: transactionDispatch } = useTransactionContext();

  const { source, destination } = getTransactionNodes(transaction);
  const { srcType, dstType } = getTransactionNodeTypes(transaction.type);

  const node = nodeLabel === "src" ? source : destination;
  const nodeType = nodeLabel === "src" ? srcType : dstType;

  const { data: nodeOptions, dispatch: nodeDispatch } = getContextData(
    typeToCollectionMap[nodeType]
  );

  const changeNode = (newNodeId: string) => {
    transactionDispatch({
      type: "EDIT",
      payload: {
        id: transaction.id,
        prop: nodeLabel,
        value: {
          id: newNodeId,
        },
      },
    });
  };

  const createNode = (newNodeName: string) => {
    const id = crypto.randomUUID();
    const newNode = {
      ...node,
      id: id,
      name: newNodeName,
    };
    nodeDispatch({
      type: "ADD",
      // @ts-expect-error
      payload: newNode,
    });
    changeNode(id);
  };

  return (
    <Selector
      options={nodeOptions}
      selectOption={changeNode}
      initValue={node}
      createOption={createNode}
    />
  );
};

export default TransactionNodeSelector;
