import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";

export interface SortInstanceType {
  id: string;
  option: string;
  isAscending: boolean;
}

interface SortEditorProps {
  sortOrder: SortInstanceType[];
  setSortOrder: (newSortOrder: SortInstanceType[]) => void;
}

const sortOptions = {
  name: "Name",
  // asset: "Asset",
  // category: "Category",
  date: "Date",
  amount: "Amount",
  type: "Type",
};

// type sortOptionKey = keyof typeof sortOptions;

const SortEditor: React.FC<SortEditorProps> = ({ sortOrder, setSortOrder }) => {
  const addSort = () => {
    setSortOrder([
      ...sortOrder,
      {
        id: crypto.randomUUID(),
        option: sortOptions.name,
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
    <div className="sort-container" onClick={(e) => e.stopPropagation()}>
      <div className="sort-menu">
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
                  {Object.values(sortOptions).map((option, ind) => {
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
            <div className="sort-menu-button" onClick={() => addSort()}>
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
