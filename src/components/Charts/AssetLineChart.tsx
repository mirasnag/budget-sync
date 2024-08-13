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
import { Asset } from "../Assets";
import { getAssetBalanceHistory } from "../../api/helpers";

interface Props {
  assets: Asset[];
}

const AssetLineChart: React.FC<Props> = ({ assets }) => {
  const data = getAssetBalanceHistory();
  const colors = randomColor({
    count: assets.length,
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
        {assets.map((asset, index) => (
          <Line
            key={asset.id}
            type="monotone"
            dataKey={asset.name}
            stroke={colors[index]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AssetLineChart;
