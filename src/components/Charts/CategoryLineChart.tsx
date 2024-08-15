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
import { getCategorySpentHistory } from "../../api/helpers";

interface Props {
  categories: Category[];
  period: string[];
}

const CategoryLineChart: React.FC<Props> = ({ categories, period }) => {
  const data = getCategorySpentHistory(period);
  const colors = randomColor({
    seed: 0,
    count: categories.length,
    luminosity: "light",
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
        <Tooltip contentStyle={{ backgroundColor: "#333" }} />
        <Legend />
        {categories.map((category, index) => (
          <Line
            key={category.id}
            type="monotone"
            dataKey={category.name}
            stroke={colors[index]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CategoryLineChart;
