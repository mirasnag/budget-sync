// library imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Interfaces
import { Category } from "../Categories";
import { getCategorySpentHistory } from "../../api/helpers";
import randomColor from "randomcolor";

interface Props {
  categories: Category[];
}

const CategoryBarChart: React.FC<Props> = ({ categories }) => {
  const data = getCategorySpentHistory();
  const colors = randomColor({ count: categories.length, luminosity: "light" });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          contentStyle={{ backgroundColor: "#333", borderColor: "#666" }}
        />
        <Legend />
        {categories.map((category, index) => (
          <Bar
            key={category.name}
            dataKey={category.name}
            fill={colors[index]}
            barSize={30}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CategoryBarChart;