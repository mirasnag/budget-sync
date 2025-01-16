// React imports
import { useEffect, useRef, useState } from "react";

// Helper functions
import {
  getTransactionNodeTypes,
  getTransactionNodes,
} from "../../utils/transactions.util";
import { useClickHandler } from "../../utils/hooks";

// Types
import { Transaction, typeToCollectionMap } from "../../utils/types";
import { useTransactionContext } from "../../store/transaction-context";
import { getContextData } from "../../store/contextProviders";

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
  const { dispatch: transactionDispatch } = useTransactionContext();

  const [open, setOpen] = useState<boolean>(false);
  const [filterStr, setFilterStr] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const clickRef = useClickHandler<HTMLDivElement>({
    onInsideClick: () => {
      setOpen(true);
    },
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

  const { data: nodeOptions, dispatch: nodeDispatch } = getContextData(
    typeToCollectionMap[nodeType]
  );

  let exactMatch: boolean = false;
  const filteredOptions = nodeOptions.filter((option) => {
    if (option.name === filterStr) exactMatch = true;
    return option.name.toLowerCase().includes(filterStr.toLowerCase());
  });

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
    setOpen(false);
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
    <div ref={clickRef} className="node-selector-container">
      {name && <div className="flex-center frame color-blue">{name}</div>}
      {!name && <div>{name}</div>}
      {open && (
        <div className="node-selector" onClick={(e) => e.stopPropagation()}>
          <input
            ref={inputRef}
            type="text"
            onChange={(e) => setFilterStr(e.currentTarget.value)}
          />
          {filteredOptions.map((nodeOption) => {
            return (
              <button
                onClick={() => changeNode(nodeOption.id)}
                className="node-option"
                key={nodeOption.id}
              >
                <div
                  key={nodeOption.id}
                  className="flex-center frame color-blue"
                >
                  {nodeOption.name}
                </div>
              </button>
            );
          })}
          {!exactMatch && !isBlank(filterStr) && (
            <button
              className="node-option"
              type="submit"
              onClick={() => createNode(filterStr)}
            >
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
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionNodeSelector;
