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
import randomColor from "randomcolor";

// Interfaces
import { Asset } from "../../api/dataModels";

interface Props {
  assets: Asset[];
  data: any[];
  formatter: (value: number, index: number) => string;
}

const AssetBarChart: React.FC<Props> = ({ assets, data, formatter }) => {
  const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const colors = randomColor({
    seed: 0,
    count: assets.length,
    luminosity: colorMode === "dark" ? "light" : "dark",
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
          contentStyle={
            colorMode === "dark"
              ? { backgroundColor: "#333", color: "#fff" }
              : { backgroundColor: "#ccc", color: "#000" }
          }
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
