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
import { getAssetBalanceHistory } from "../../api/helpers";
import randomColor from "randomcolor";
import { Asset } from "../Assets";

interface Props {
  assets: Asset[];
}

const AssetBarChart: React.FC<Props> = ({ assets }) => {
  const data = getAssetBalanceHistory();
  const colors = randomColor({ count: assets.length, luminosity: "light" });

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
