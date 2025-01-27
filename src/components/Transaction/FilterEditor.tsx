// Library imports
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";

// helper functions
import { formatDateToInputValue } from "../../utils/formatting";

// interfaces
import { Asset, Category } from "../../utils/types";

export interface FilterInstanceType {
  id: string;
  option: string[]; // length = 2
  value: string | null;
}

export const filterOptions = {
  Name: ["Contains", "Is", "Starts With"],
  // Asset: ["Is", "Is not"],
  // Category: ["Is", "Is not"],
  Date: ["Is", "Is before", "Is after"],
  Amount: ["Equal", "More", "Less", "At Least", "At Most"],
  // Type: ["Is", "Is not"],
};

export type FilterOptionKey = keyof typeof filterOptions;

interface FilterOptionInputProps {
  filterInstance: FilterInstanceType;
  filterOrder: FilterInstanceType[];
  setFilterOrder: (newFilterOrder: FilterInstanceType[]) => void;
  getDefaultFilterValue: (option: string) => string;
  assets: Asset[];
  categories: Category[];
}

const FilterOptionInput: React.FC<FilterOptionInputProps> = ({
  filterInstance,
  filterOrder,
  setFilterOrder,
  getDefaultFilterValue,
}) => {
  const editFilter = (id: string, option: string[], value: string | null) => {
    setFilterOrder(
      filterOrder.map((d) => {
        if (d.id === id)
          d = {
            id: id,
            option: option,
            value: value ?? getDefaultFilterValue(option[0]),
          };
        return d;
      })
    );
  };

  const { id, option, value } = filterInstance;
  const optionFirst = option[0] as FilterOptionKey;
  const optionSecond = option[1];
  return (
    <>
      <select
        className="btn"
        defaultValue={optionFirst}
        onChange={(e) =>
          editFilter(
            id,
            [
              e.target.value,
              filterOptions[e.target.value as FilterOptionKey][0],
            ],
            null
          )
        }
      >
        {Object.keys(filterOptions).map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        className="btn"
        defaultValue={optionSecond}
        onChange={(e) => editFilter(id, [optionFirst, e.target.value], value)}
      >
        {filterOptions[optionFirst].map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </>
  );
};

interface FilterValueInputProps {
  filterInstance: FilterInstanceType;
  filterOrder: FilterInstanceType[];
  setFilterOrder: (newFilterOrder: FilterInstanceType[]) => void;
  getDefaultFilterValue: (option: string) => string;
  assets: Asset[];
  categories: Category[];
}

const FilterValueInput: React.FC<FilterValueInputProps> = ({
  filterInstance,
  filterOrder,
  setFilterOrder,
  getDefaultFilterValue,
  assets,
  categories,
}) => {
  const editFilter = (id: string, option: string[], value: string | null) => {
    setFilterOrder(
      filterOrder.map((d) => {
        if (d.id === id)
          d = {
            id: id,
            option: option,
            value: value ?? getDefaultFilterValue(option[0]),
          };
        return d;
      })
    );
  };

  const { id, option, value } = filterInstance;
  const defValue = value ?? getDefaultFilterValue(option[0]);
  switch (option[0]) {
    case "Name":
      return (
        <input
          className="btn"
          type="text"
          defaultValue={defValue}
          onChange={(e) => editFilter(id, option, e.target.value)}
        />
      );
    case "Asset":
      return (
        <select
          className="btn"
          defaultValue={defValue}
          onChange={(e) => editFilter(id, option, e.target.value)}
        >
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </select>
      );
    case "Category":
      return (
        <select
          className="btn"
          defaultValue={defValue}
          onChange={(e) => editFilter(id, option, e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      );
    case "Type":
      return (
        <select
          className="btn"
          defaultValue={defValue}
          onChange={(e) => editFilter(id, option, e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
        </select>
      );
    case "Amount":
      return (
        <input
          className="btn"
          type="number"
          defaultValue={defValue}
          onChange={(e) => editFilter(id, option, e.target.value)}
        />
      );
    case "Date":
      return (
        <input
          className="btn"
          type="date"
          defaultValue={defValue}
          onChange={(e) => editFilter(id, option, e.target.value)}
        />
      );
  }
};

interface FilterEditorProps {
  assets: Asset[];
  categories: Category[];
  filterOrder: FilterInstanceType[];
  setFilterOrder: (newFilterOrder: FilterInstanceType[]) => void;
}

const FilterEditor: React.FC<FilterEditorProps> = ({
  assets,
  categories,
  filterOrder,
  setFilterOrder,
}) => {
  const addFilter = () => {
    setFilterOrder([
      ...filterOrder,
      {
        id: crypto.randomUUID(),
        option: ["Name", "Contains"],
        value: getDefaultFilterValue("Name"),
      },
    ]);
  };

  const deleteFilter = (id: string) => {
    setFilterOrder(filterOrder.filter((x) => x.id !== id));
  };

  const getDefaultFilterValue = (option: string) => {
    switch (option) {
      case "Asset":
        return assets[0].id;
      case "Category":
        return categories[0].id;
      case "Date":
        return formatDateToInputValue(new Date());
      case "Type":
        return "expense";
      default:
        return "";
    }
  };

  return (
    <div className="sort-filter-container" onClick={(e) => e.stopPropagation()}>
      <div className="sort-filter-menu">
        <span>Filter By</span>
        <div className="filter-menu">
          {filterOrder.map((inst) => {
            return (
              <div className="filter-menu-object" key={inst.id}>
                <FilterOptionInput
                  filterInstance={inst}
                  filterOrder={filterOrder}
                  setFilterOrder={setFilterOrder}
                  getDefaultFilterValue={getDefaultFilterValue}
                  assets={assets}
                  categories={categories}
                />

                <FilterValueInput
                  filterInstance={inst}
                  filterOrder={filterOrder}
                  setFilterOrder={setFilterOrder}
                  getDefaultFilterValue={getDefaultFilterValue}
                  assets={assets}
                  categories={categories}
                />
                <div
                  className="btn btn-red flex-center"
                  onClick={() => deleteFilter(inst.id)}
                >
                  <XMarkIcon width={16} />
                </div>
              </div>
            );
          })}
          <div>
            <div className="filter-menu-button" onClick={() => addFilter()}>
              <div className="flex-center">
                <PlusIcon width={20} />
                Add filter
              </div>
            </div>
          </div>
          <div>
            <div
              className="filter-menu-button"
              onClick={() => setFilterOrder([])}
            >
              <div className="flex-center">
                <TrashIcon width={20} />
                Remove filter
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterEditor;
