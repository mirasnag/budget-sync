// react imports
import { useState } from "react";

// library imports
import { ArrowsUpDownIcon, FunnelIcon } from "@heroicons/react/20/solid";

// UI components
import FilterEditor, { FilterInstanceType } from "../Transaction/FilterEditor";
import SortEditor, { SortInstanceType } from "../Transaction/SortEditor";

// helper functions
import {
  // getTransactionNodes,
  sortFilterTransactions2,
} from "../../utils/transactions.util";
import { useClickHandler } from "../../utils/hooks";

import { useTransactionContext } from "../../store/transaction-context";
import { useAssetContext } from "../../store/asset-context";
import { useCategoryContext } from "../../store/category-context";
import TransactionTable from "../Transaction/TransactionTable";

interface Transactions {}

const Transactions: React.FC<Transactions> = () => {
  const { data: transactions } = useTransactionContext();
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

  const processedTransactions = sortFilterTransactions2(
    transactions,
    activeFilterOrder,
    activeSortOrder
  );

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

      <TransactionTable transactions={processedTransactions} />
    </div>
  );
};

export default Transactions;
