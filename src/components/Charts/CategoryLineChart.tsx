// library imports
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import randomColor from "randomcolor";

// interfaces
import { Category } from "../Dashboard/Categories";

interface Props {
  categories: Category[];
  data: any[];
  formatter: (value: number, index: number) => string;
}

const CategoryLineChart: React.FC<Props> = ({
  categories,
  data,
  formatter,
}) => {
  const colors = randomColor({
    seed: 100,
    count: categories.length,
    luminosity: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "light"
      : "dark",
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          contentStyle={{ backgroundColor: "#333" }}
          formatter={(value, ...props) => formatter(Number(value), props[2])}
        />
        <Legend />
        {categories.map((category, index) => (
          <Line
            key={category.id}
            type="monotone"
            dataKey={category.name}
            stroke={colors[index]}
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CategoryLineChart;
