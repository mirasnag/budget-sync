// // library imports
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import randomColor from "randomcolor";

// // helper functions
// import { DataItem, spentByAsset } from "../../api/helpers";

// // interfaces
// import { Asset } from "../Assets";

// interface Props {
//   assets: Asset[];
//   currencyRates: DataItem;
// }

// const AssetPieChart: React.FC<Props> = ({ assets, currencyRates }) => {
//   const colors = randomColor({
//     count: assets.length,
//     luminosity: "light",
//   });

//   const data = assets.map((asset, index) => {
//     return {
//       name: asset.name,
//       value: spentByAsset(asset, currencyRates),
//       color: colors[index],
//     };
//   });

//   return (
//     <div className="Asset-piechart">
//       <h3>Asset Piechart</h3>
//       <ResponsiveContainer width="50%" height={300}>
//         <PieChart>
//           <Pie
//             data={data}
//             dataKey="value"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={100}
//             fill="#8884d8"
//             label
//           >
//             {data.map((d, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={colors[index % colors.length]}
//               />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend
//             layout="vertical"
//             align="right"
//             verticalAlign="top"
//             iconType="circle"
//             iconSize={25}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default AssetPieChart;
