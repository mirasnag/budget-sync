// // react imports
// import { useState } from "react";

// // helper functions
// import { formatCurrency } from "../../utils/formatting";
// import { convertCurrency } from "../../utils/currency.util";
// import { spentByCategory } from "../../utils/entities.util";

// // interfaces
// import { CurrencyRates } from "../../utils/types";

// // components
// import CategoryForm from "./CategoryForm";
// import AddButton from "../Buttons/AddButton";
// import EditButton from "../Buttons/EditButton";
// import DeleteButton from "../Buttons/DeleteButton";
// import PeriodSelector, { Period } from "../Buttons/PeriodSelector";
// import CurrencySelector from "../Currency/CurrencySelector";

// // context
// import { useCategoryContext } from "../../store/category-context";
// import { useTransactionContext } from "../../store/transaction-context";

// interface CategoriesProps {
//   currencyRates: CurrencyRates;
// }

// const Categories: React.FC<CategoriesProps> = ({ currencyRates }) => {
//   const { data: categories, dispatch: categoryDispatch } = useCategoryContext();
//   const { data: transactions } = useTransactionContext();

//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState("");
//   const [categoryPeriod, setCategoryPeriod] = useState<Period>({
//     type: "relative",
//     option: "This",
//     value: null,
//     unit: "Month",
//   });
//   const [baseCurrency, setBaseCurrency] = useState<string | null>(null);

//   const closeForm = () => {
//     setShowCreateForm(false);
//     setShowEditForm("");
//   };

//   let periodMonths;

//   if (categoryPeriod.type === "absolute") {
//     const startDate = new Date(categoryPeriod.start);
//     const endDate = new Date(categoryPeriod.end);
//     periodMonths =
//       (endDate.getFullYear() - startDate.getFullYear()) * 12 +
//       (endDate.getMonth() - startDate.getMonth());
//   } else {
//     switch (categoryPeriod.unit) {
//       case "Year":
//         periodMonths = 12 * Number(categoryPeriod.value);
//         break;
//       case "Month":
//         periodMonths = Number(categoryPeriod.value ?? 1);
//         break;
//       default:
//         periodMonths = 1;
//     }
//   }

//   const deleteCategory = (id: string) => {
//     categoryDispatch({
//       type: "DELETE",
//       payload: id,
//     });
//   };

//   return (
//     <div className="categories component">
//       <div className="header">
//         <h2>Categories</h2>
//         <div className="header-menu">
//           <CurrencySelector
//             baseCurrency={baseCurrency}
//             setBaseCurrency={setBaseCurrency}
//           />
//           <AddButton handleClick={() => setShowCreateForm(true)} />
//           <PeriodSelector
//             period={categoryPeriod}
//             setPeriod={setCategoryPeriod}
//           />
//         </div>
//       </div>

//       {categories.map((category) => {
//         const periodBudgeted = (category.amount ?? 0) * periodMonths;
//         const total = baseCurrency
//           ? convertCurrency(
//               currencyRates,
//               category.currency,
//               baseCurrency,
//               periodBudgeted
//             )
//           : periodBudgeted;
//         const spent = baseCurrency
//           ? convertCurrency(
//               currencyRates,
//               category.currency,
//               baseCurrency,
//               spentByCategory(
//                 category,
//                 currencyRates,
//                 categoryPeriod,
//                 transactions
//               )
//             )
//           : spentByCategory(
//               category,
//               currencyRates,
//               categoryPeriod,
//               transactions
//             );

//         const remaining = total - spent;
//         const currency = baseCurrency ?? category.currency;
//         const spentPercentage = total > 0 ? (spent / total) * 100 : 0;

//         return (
//           <div key={category.id} className="category">
//             <span className="category-name frame frame-large color-blue">
//               {category.name}
//             </span>
//             <div className="category-bar-wrapper">
//               <div className="category-bar-back">
//                 <div
//                   className="category-bar"
//                   style={{
//                     width: `${spentPercentage}%`,
//                   }}
//                 ></div>
//               </div>
//               <div className="labels">
//                 <span>
//                   Spent: {formatCurrency(spent, currency)} | Remaining:{" "}
//                   {formatCurrency(remaining, currency)}
//                 </span>
//                 <span>Total: {formatCurrency(total, currency)}</span>
//               </div>
//             </div>
//             <div className="table-btns">
//               <EditButton handleClick={() => setShowEditForm(category.id)} />
//               <DeleteButton handleClick={() => deleteCategory(category.id)} />
//             </div>
//           </div>
//         );
//       })}

//       {showCreateForm && <CategoryForm onClose={closeForm} category_id="" />}

//       {showEditForm !== "" && (
//         <CategoryForm onClose={closeForm} category_id={showEditForm} />
//       )}
//     </div>
//   );
// };

// export default Categories;
