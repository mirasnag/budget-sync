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
import { DataItem, spentByCategory } from "../../api/helpers";

// interfaces
import { Category } from "../Categories";

interface Props {
  categories: Category[];
  currencyRates: DataItem;
}

const CategoryPieChart: React.FC<Props> = ({ categories, currencyRates }) => {
  const colors = randomColor({
    count: categories.length,
    luminosity: "light",
  });

  const data = categories.map((category, index) => {
    return {
      name: category.name,
      value: spentByCategory(category, currencyRates, ["None"]),
      color: colors[index],
    };
  });

  return (
    <ResponsiveContainer width="50%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((d, index) => (
            <Cell key={`cell-${index}`} fill={d.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="top"
          iconType="circle"
          iconSize={25}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;