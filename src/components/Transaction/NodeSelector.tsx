// Helper functions
import {
  getTransactionNodeTypes,
  getTransactionNodes,
} from "../../utils/transactions.util";

// Types
import { Entity, Transaction, typeToCollectionMap } from "../../utils/types";
import { getContextData } from "../../store/contextProviders";
import Selector from "../Controls/Selector";
import { createItem } from "../../utils/api";

interface TransactionNodeSelectorProps {
  transaction: Transaction;
  nodeLabel: "src" | "dst";
  onNodeChange: (newNodeId: string) => void;
}

const TransactionNodeSelector: React.FC<TransactionNodeSelectorProps> = ({
  transaction,
  nodeLabel,
  onNodeChange,
}) => {
  const { source, destination } = getTransactionNodes(transaction);
  const { srcType, dstType } = getTransactionNodeTypes(transaction.type);

  const node = nodeLabel === "src" ? source : destination;
  const nodeType = nodeLabel === "src" ? srcType : dstType;

  const { data: nodeOptions, dispatch: nodeDispatch } = getContextData(
    typeToCollectionMap[nodeType]
  );

  const changeNode = (newNodeId: string) => {
    onNodeChange(newNodeId);
  };

  const createNode = async (newNodeName: string) => {
    const newNode = (await createItem({
      type: nodeType,
      name: newNodeName,
    })) as Entity;

    nodeDispatch({
      type: "ADD",
      // @ts-expect-error
      payload: newNode,
    });
    changeNode(newNode.id);
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
