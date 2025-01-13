// library imports
import randomColor from "randomcolor";

// helper functions
import { formatDateMonthStr } from "../../utils/formatting";

// interfaces
import { Category } from "../../utils/types";

interface Props {
  categories: Category[];
  data: any[];
  formatter: (value: number, index: number) => string;
}

const CategoryTable: React.FC<Props> = ({ categories, data, formatter }) => {
  const tableHeader = [
    "Name",
    ...data?.map((d) => formatDateMonthStr(d.month)),
  ];
  const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const colors = randomColor({
    seed: 462,
    count: categories.length,
    luminosity: colorMode === "dark" ? "light" : "dark",
  });

  return (
    <table>
      <thead>
        <tr>
          {tableHeader.map((d, index) => (
            <th key={index}>{d}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {categories.map((category, categoryIndex) => {
          return (
            <tr key={category.id}>
              <td key="-1">
                <div
                  className="frame"
                  style={
                    colorMode === "dark"
                      ? { background: colors[categoryIndex], color: "#000" }
                      : { background: colors[categoryIndex], color: "#fff" }
                  }
                >
                  {category.name}
                </div>
              </td>
              {data.map((d, index) => {
                return (
                  <td key={index}>
                    {formatter(d[category.name], categoryIndex)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CategoryTable;
