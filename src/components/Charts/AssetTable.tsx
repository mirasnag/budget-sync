// library imports
import randomColor from "randomcolor";

// helper functions
import { formatDateMonthStr } from "../../utils/formatting";

// interfaces
import { Asset } from "../../utils/types";

interface Props {
  assets: Asset[];
  data: any[];
  formatter: (value: number, index: number) => string;
}

const AssetTable: React.FC<Props> = ({ assets, data, formatter }) => {
  const tableHeader = [
    "Name",
    ...data?.map((d) => formatDateMonthStr(d.month)),
  ];
  const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const colors = randomColor({
    seed: 0,
    count: assets.length,
    luminosity: colorMode === "dark" ? "light" : "dark",
  });

  return (
    <table>
      <thead>
        <tr>
          {tableHeader.map((d, index) => (
            <th key={index}>{d}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {assets.map((asset, assetIndex) => {
          return (
            <tr key={assetIndex}>
              <td>
                <div
                  className="frame frame-large"
                  style={
                    colorMode === "dark"
                      ? { background: colors[assetIndex], color: "#000" }
                      : { background: colors[assetIndex], color: "#fff" }
                  }
                >
                  {asset.name}
                </div>
              </td>
              {data.map((d, index) => {
                return (
                  <td key={index}>{formatter(d[asset.name], assetIndex)}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default AssetTable;
