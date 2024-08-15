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
import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        loader: dashboardLoader,
        action: dashboardAction,
        errorElement: <ErrorPage />,
      },
      {
        path: "/transactions",
        element: <TransactionsPage />,
        loader: transactionsPageLoader,
        action: transactionsPageAction,
        errorElement: <ErrorPage />,
      },
      {
        path: "/spending-analysis",
        element: <SpendingAnalysisPage />,
        loader: spendingAnalysisLoader,
        errorElement: <ErrorPage />,
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
