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
import randomColor from "randomcolor";
import { Asset } from "../Dashboard/Assets";

interface Props {
  assets: Asset[];
  data: any[];
  formatter: (value: number, index: number) => string;
}

const AssetBarChart: React.FC<Props> = ({ assets, data, formatter }) => {
  const colors = randomColor({
    seed: 0,
    count: assets.length,
    luminosity: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "light"
      : "dark",
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
        {assets.map((asset, index) => (
          <Bar
            key={asset.name}
            dataKey={asset.name}
            fill={colors[index]}
            barSize={30}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AssetBarChart;
