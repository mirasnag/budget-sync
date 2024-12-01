import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { SortInstanceType } from "../Dashboard/Transactions";

interface SortEditorProps {
  sortOrder: SortInstanceType[];
  setSortOrder: (newSortOrder: SortInstanceType[]) => void;
}

const SortEditor: React.FC<SortEditorProps> = ({ sortOrder, setSortOrder }) => {
  const sortOptions = [
    "Name",
    // "Asset",
    // "Category",
    "Date",
    "Amount",
    "Type",
  ];

  const addSort = (option: string) => {
    setSortOrder([
      ...sortOrder,
      {
        id: crypto.randomUUID(),
        option: option === "" ? "Name" : "",
        isAscending: true,
      },
    ]);
  };

  const deleteSort = (id: string) => {
    setSortOrder(sortOrder.filter((x) => x.id !== id));
  };

  const editSort = (id: string, option: string, isAscending: boolean) => {
    setSortOrder(
      sortOrder.map((d) => {
        if (d.id === id)
          d = { id: id, option: option, isAscending: isAscending };
        return d;
      })
    );
  };

  return (
    <div className="sort-filter-container">
      <div className="sort-filter-menu">
        <span>Sort By</span>
        <div className="sort-menu">
          {sortOrder.map((d) => {
            return (
              <div className="sort-menu-object" key={d.id}>
                <select
                  className="btn"
                  defaultValue={d.option}
                  onChange={(e) => {
                    editSort(d.id, e.target.value, d.isAscending);
                  }}
                >
                  {sortOptions.map((option, ind) => {
                    return (
                      <option key={ind} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
                <select
                  className="btn"
                  value={d.isAscending ? "Ascending" : "Descending"}
                  onChange={(e) => {
                    editSort(d.id, d.option, e.target.value === "Ascending");
                  }}
                >
                  <option value="Ascending">Ascending</option>
                  <option value="Descending">Descending</option>
                </select>
                <div
                  className="btn btn-red flex-center"
                  onClick={() => deleteSort(d.id)}
                >
                  <XMarkIcon width={16} />
                </div>
              </div>
            );
          })}
          <div>
            <div className="sort-menu-button" onClick={() => addSort("")}>
              <div className="flex-center">
                <PlusIcon width={20} />
                Add sort
              </div>
            </div>
          </div>
          <div>
            <div className="sort-menu-button" onClick={() => setSortOrder([])}>
              <div className="flex-center">
                <TrashIcon width={20} />
                Remove sort
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortEditor;
