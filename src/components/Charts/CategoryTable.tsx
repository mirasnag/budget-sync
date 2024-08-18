import randomColor from "randomcolor";
import { formatDateMonthStr } from "../../api/helpers";
import { Category } from "../Dashboard/Categories";

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
  const colors = randomColor({
    seed: 100,
    count: categories.length,
    luminosity: "light",
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
                  style={{ background: colors[categoryIndex], color: "black" }}
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
