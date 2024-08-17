// react imports
import { useRef, useState } from "react";

// rrd imports
import { Form, Link } from "react-router-dom";

// library imports
import {
  ArrowsUpDownIcon,
  FunnelIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

// interfaces
import { Asset } from "./Assets";
import { Category } from "./Categories";

// components
import TransactionForm from "./TransactionForm";

// helper functions
import {
  formatCurrency,
  formatDate,
  getAllMatchingItems,
  sortFilterTransactions,
} from "../../api/helpers";

export interface Transaction {
  id: string;
  name: string;
  asset_id: string;
  category_id: string;
  amount: number;
  currency: string;
  date: Date;
  createdAt: Date;
  type: string;
}

export interface TransactionTableProps {
  transactions: Transaction[];
  assets: Asset[];
  categories: Category[];
  isRecent?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  assets,
  categories,
  isRecent = true,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState("");

  const filterOptionRef = useRef<HTMLSelectElement>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterOption, setFilterOption] = useState<string>("None");
  const [filterValue, setFilterValue] = useState<string[]>([""]);
  const handleFilter = () => {
    const option = filterOptionRef.current?.value;
    setFilterOption(option as string);
    switch (option) {
      case "Amount":
        setFilterValue(["", ""]);
        break;
      case "Date":
        setFilterValue(["this", "1", "month"]);
        break;
      default:
        setFilterValue([""]);
    }
  };

  const sortOptionRef = useRef<HTMLSelectElement>(null);
  const sortValueRef = useRef<HTMLSelectElement>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortOption, setSortOption] = useState<string>("None");
  const [sortValue, setSortValue] = useState<string>("Ascending");
  const handleSort = () => {
    setSortOption(sortOptionRef.current?.value as string);
    setSortValue("Ascending");
  };

  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm("");
  };

  const tableHeader = ["Name", "Asset", "Category", "Date", "Amount", ""];
  const sortFilterOptions = [
    "None",
    "Name",
    "Asset",
    "Category",
    "Date",
    "Amount",
    "Type",
  ];
  const processedTransactions = isRecent
    ? sortFilterTransactions(
        transactions,
        "Date",
        ["past", "99", "year"],
        "Date",
        "Descending"
      ).slice(0, 5)
    : sortFilterTransactions(
        transactions,
        filterOption,
        filterValue,
        sortOption,
        sortValue
      );

  const renderFilterValueInput = () => {
    switch (filterOption) {
      case "Name":
        return (
          <div className="sort-filter-input">
            <input
              type="text"
              defaultValue={filterValue[0] as string}
              onChange={(e) => setFilterValue([e.target.value])}
              placeholder="Enter Name"
            />
          </div>
        );
      case "Asset":
        return (
          <div className="sort-filter-input">
            <select
              defaultValue={filterValue[0] as string}
              onChange={(e) => setFilterValue([e.target.value])}
            >
              <option value="">
                {filterValue.length === 1 && filterValue[0] === ""
                  ? "Select Asset"
                  : "Remove Filter"}
              </option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>
        );
      case "Category":
        return (
          <div className="sort-filter-input">
            <select
              defaultValue={filterValue[0] as string}
              onChange={(e) => setFilterValue([e.target.value])}
            >
              <option value="">
                {filterValue.length === 1 && filterValue[0] === ""
                  ? "Select Category"
                  : "Remove Filter"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        );
      case "Type":
        return (
          <div className="sort-filter-input">
            <select
              defaultValue={filterValue[0] as string}
              onChange={(e) => setFilterValue([e.target.value])}
            >
              <option value="">
                {filterValue.length === 1 && filterValue[0] === ""
                  ? "Select Type"
                  : "Remove Filter"}
              </option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        );
      case "Amount":
        return (
          <div className="sort-filter-input">
            <div>
              <span>Min:</span>
              <input
                type="number"
                defaultValue={filterValue[0] as string}
                onChange={(e) =>
                  setFilterValue([e.target.value, filterValue[1]])
                }
                placeholder="Enter Amount"
              />
            </div>
            <div>
              <span>Max:</span>
              <input
                type="number"
                defaultValue={filterValue[1] as string}
                onChange={(e) =>
                  setFilterValue([filterValue[0], e.target.value])
                }
                placeholder="Enter Amount"
              />
            </div>
          </div>
        );
      case "Date":
        return (
          <div className="sort-filter-input">
            <div className="date-input">
              <select
                defaultValue={filterValue[0]}
                onChange={(e) =>
                  setFilterValue([
                    e.target.value,
                    filterValue[1],
                    filterValue[2],
                  ])
                }
              >
                <option value="past">Past</option>
                <option value="this">This</option>
                <option value="next">Next</option>
              </select>
              {(filterValue[0] === "past" || filterValue[0] === "next") && (
                <input
                  type="number"
                  min={1}
                  max={100}
                  defaultValue={filterValue[1]}
                  onChange={(e) => {
                    setFilterValue([
                      filterValue[0],
                      e.target.value,
                      filterValue[2],
                    ]);
                  }}
                />
              )}
              <select
                defaultValue={filterValue[2]}
                onChange={(e) =>
                  setFilterValue([
                    filterValue[0],
                    filterValue[1],
                    e.target.value,
                  ])
                }
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="transactions">
      <div className="header">
        <h2>{isRecent && "Recent"} Transactions</h2>
        <div className="btns">
          <button
            className="btn btn-green"
            onClick={() => {
              if (assets.length === 0 && categories.length === 0) {
                alert(
                  "No assets and categories available. Please add them first."
                );
                return;
              }
              if (assets.length === 0) {
                alert("No assets available. Please add an asset first.");
                return;
              }
              if (categories.length === 0) {
                alert("No categories available. Please add a category first.");
                return;
              }
              setShowCreateForm(true);
            }}
          >
            <PlusIcon width={20} />
          </button>

          {isRecent && (
            <Link to="/transactions" className="btn view-all-transactions">
              <span>View All</span>
            </Link>
          )}

          {!isRecent && (
            <button
              className={showSortMenu ? "btn color-green" : "btn"}
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowFilterMenu(false);
              }}
            >
              <ArrowsUpDownIcon width={20} />
            </button>
          )}

          {!isRecent && (
            <button
              className={showFilterMenu ? "btn color-green" : "btn"}
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
                setShowSortMenu(false);
              }}
            >
              <FunnelIcon width={20} />
            </button>
          )}

          {showSortMenu && (
            <div className="sort-filter-container">
              <div className="sort-filter-menu">
                <span>Sort By</span>
                <div className="sort-filter-options">
                  <select
                    size={sortFilterOptions.length}
                    ref={sortOptionRef}
                    defaultValue={sortOption}
                    onChange={() => handleSort()}
                  >
                    {sortFilterOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <select
                  ref={sortValueRef}
                  defaultValue={sortValue}
                  onChange={() =>
                    setSortValue(sortValueRef.current?.value as string)
                  }
                >
                  <option value="Ascending">Ascending</option>
                  <option value="Descending">Descending</option>
                </select>
              </div>
            </div>
          )}

          {showFilterMenu && (
            <div className="sort-filter-container">
              <div className="sort-filter-menu">
                <span>Filter By</span>
                <div className="sort-filter-options">
                  <select
                    size={sortFilterOptions.length}
                    ref={filterOptionRef}
                    defaultValue={filterOption}
                    onChange={() => handleFilter()}
                  >
                    {sortFilterOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {renderFilterValueInput()}
              </div>
            </div>
          )}
        </div>
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
          {processedTransactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.name}</td>
              <td>
                <div className="frame color-aqua">
                  {getAllMatchingItems("assets", "id", transaction.asset_id)[0]
                    ?.name ?? ""}
                </div>
              </td>
              <td>
                <div className="frame color-aqua">
                  {getAllMatchingItems(
                    "categories",
                    "id",
                    transaction.category_id
                  )[0]?.name ?? ""}
                </div>
              </td>
              <td>{formatDate(transaction.date)}</td>
              <td>
                <div
                  className={
                    transaction.type === "income"
                      ? "frame color-green"
                      : "frame color-red"
                  }
                >
                  {formatCurrency(transaction.amount, transaction.currency)}
                </div>
              </td>
              <td>
                <div className="table-btns">
                  <button
                    onClick={() => setShowEditForm(transaction.id)}
                    className="btn"
                  >
                    <PencilIcon width={20} />
                  </button>
                  <Form method="post">
                    <input
                      type="hidden"
                      name="_action"
                      value="deleteTransaction"
                    />
                    <input
                      type="hidden"
                      name="transaction_id"
                      value={transaction.id}
                    />
                    <button type="submit" className="btn btn-red">
                      <TrashIcon width={20} />
                    </button>
                  </Form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateForm && (
        <TransactionForm
          assets={assets}
          categories={categories}
          transaction_id={""}
          onClose={closeForm}
        />
      )}

      {showEditForm !== "" && (
        <TransactionForm
          assets={assets}
          categories={categories}
          transaction_id={showEditForm}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default TransactionTable;
