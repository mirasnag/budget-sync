// React imports
import { useState } from "react";

// Helper functions
import {
  getTransactionNodeTypes,
  getTransactionNodes,
} from "../../utils/transactions.util";
import { editTransactionProp, fetchData } from "../../utils/services";

// Types
import { Entity, Transaction, typeToCollectionMap } from "../../utils/types";

interface TransactionNodeSelectorProps {
  transaction: Transaction;
  nodeLabel: "src" | "dst";
}

const isBlank = (str: string) => {
  return !str || /^\s*$/.test(str);
};

const TransactionNodeSelector: React.FC<TransactionNodeSelectorProps> = ({
  transaction,
  nodeLabel,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [filterStr, setFilterStr] = useState<string>("");

  const { source, destination } = getTransactionNodes(transaction);
  const { srcType, dstType } = getTransactionNodeTypes(transaction.type);

  const node = nodeLabel === "src" ? source : destination;
  const nodeType = nodeLabel === "src" ? srcType : dstType;
  const name = node?.name ?? "";

  const nodeOptions = fetchData(typeToCollectionMap[nodeType]) as Entity[];

  let exactMatch: boolean = false;
  const filteredOptions = nodeOptions.filter((option) => {
    if (option.name === filterStr) exactMatch = true;
    return option.name.toLowerCase().includes(filterStr.toLowerCase());
  });

  const changeNode = (newNodeId: string) => {
    const newNode = {
      ...transaction[nodeLabel],
      id: newNodeId,
    };
    editTransactionProp(transaction.id, nodeLabel, newNode);
    transaction[nodeLabel] = newNode;
    setOpen(false);
  };

  const createNode = (newNodeName: string) => {
    console.log(newNodeName);
  };

  return (
    <div className="node-selector-container" onClick={() => setOpen(!open)}>
      {name && <div className="flex-center frame color-blue">{name}</div>}
      {!name && <div>{name}</div>}
      {open && (
        <div className="node-selector" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            onChange={(e) => setFilterStr(e.currentTarget.value)}
          />
          {filteredOptions.map((nodeOption) => {
            return (
              <div
                className="node-option"
                onClick={() => changeNode(nodeOption.id)}
                key={nodeOption.id}
              >
                <div
                  key={nodeOption.id}
                  className="flex-center frame color-blue"
                >
                  {nodeOption.name}
                </div>
              </div>
            );
          })}
          {!exactMatch && !isBlank(filterStr) && (
            <div className="node-option" onClick={() => createNode(filterStr)}>
              <div className="flex-center node-selector-create">
                <span>Create: </span>
                <div
                  key={"createOption"}
                  className="flex-center frame color-blue"
                >
                  {filterStr}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionNodeSelector;
