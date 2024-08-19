import randomColor from "randomcolor";
import { formatDateMonthStr } from "../../api/helpers";
import { Asset } from "../Dashboard/Assets";

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
  const colors = randomColor({
    seed: 0,
    count: assets.length,
    luminosity: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "light"
      : "dark",
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
                  className="frame"
                  style={{ background: colors[assetIndex], color: "black" }}
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
