// React imports
import { useState } from "react";
import { Form } from "react-router-dom";

// Helper functions
import {
  getTransactionNodeTypes,
  getTransactionNodes,
} from "../../utils/transactions.util";
import {
  createItem,
  editTransactionProp,
  fetchData,
} from "../../utils/services";
import { useClickHandler } from "../../utils/hooks";

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

  const clickRef = useClickHandler<HTMLDivElement>({
    onInsideClick: () => setOpen(true),
    onOutsideClick: () => {
      setOpen(false);
      setFilterStr("");
    },
  });

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
    const id = crypto.randomUUID();
    createItem({
      id: id,
      type: nodeType,
      name: newNodeName,
    });
    changeNode(id);
    setOpen(false);
  };

  return (
    <div ref={clickRef} className="node-selector-container">
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
              <Form
                method="post"
                className="node-option"
                onSubmit={() => changeNode(nodeOption.id)}
              >
                <button key={nodeOption.id}>
                  <div
                    key={nodeOption.id}
                    className="flex-center frame color-blue"
                  >
                    {nodeOption.name}
                  </div>
                </button>
              </Form>
            );
          })}
          {!exactMatch && !isBlank(filterStr) && (
            <Form
              method="post"
              className="node-option"
              onSubmit={() => createNode(filterStr)}
            >
              <button type="submit">
                <div className="flex-center node-selector-create">
                  <span>Create: </span>
                  <div
                    key={"createOption"}
                    className="flex-center frame color-blue"
                  >
                    {filterStr}
                  </div>
                </div>
              </button>
            </Form>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionNodeSelector;
