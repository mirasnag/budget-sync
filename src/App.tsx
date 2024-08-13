// rrd imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// components
import Layout from "./components/Layout";

// pages
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import TransactionsPage, {
  transactionsPageAction,
  transactionsPageLoader,
} from "./pages/TransactionsPage";
import SpendingAnalysisPage, {
  spendingAnalysisLoader,
} from "./pages/SpendingAnalysisPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        loader: dashboardLoader,
        action: dashboardAction,
      },
      {
        path: "/transactions",
        element: <TransactionsPage />,
        loader: transactionsPageLoader,
        action: transactionsPageAction,
      },
      {
        path: "/spending-analysis",
        element: <SpendingAnalysisPage />,
        loader: spendingAnalysisLoader,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
