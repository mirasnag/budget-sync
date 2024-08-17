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
import { Category } from "../Dashboard/Categories";
import randomColor from "randomcolor";

interface Props {
  categories: Category[];
  data: any[];
  formatter: (value: number, index: number) => string;
}

const CategoryBarChart: React.FC<Props> = ({ categories, data, formatter }) => {
  const colors = randomColor({
    seed: 100,
    count: categories.length,
    luminosity: "light",
  });

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
          cursor={false}
          contentStyle={{ backgroundColor: "#333", borderColor: "#666" }}
          formatter={(value, ...props) => formatter(Number(value), props[2])}
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
