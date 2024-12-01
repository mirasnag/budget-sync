// library imports
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

const CategoryPieChart: React.FC<Props> = ({ categories, data, formatter }) => {
  const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const colors = randomColor({
    seed: 0,
    count: categories.length,
    luminosity: colorMode === "dark" ? "light" : "dark",
  });

  return (
    <div className="pie-chart-wrapper">
      {data.map((monthData) => {
        const pieData = categories.map((category, index) => {
          return {
            name: category.name,
            value: monthData[category.name],
            color: colors[index],
          };
        });

        return (
          <div className="pie-chart">
            <h3>{formatDateMonthStr(monthData.month)}</h3>
            <ResponsiveContainer width="80%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((d, index) => {
                    return <Cell key={`cell-${index}`} fill={d.color} />;
                  })}
                </Pie>
                <Tooltip
                  formatter={(value, ...props) =>
                    formatter(Number(value), props[2])
                  }
                  contentStyle={
                    colorMode === "dark"
                      ? { backgroundColor: "#ccc" }
                      : { backgroundColor: "#ccc" }
                  }
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="top"
                  iconType="circle"
                  iconSize={25}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryPieChart;
