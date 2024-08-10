// rrd imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// components
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import Layout from "./components/Layout";
import TransactionsPage, {
  transactionsPageAction,
  transactionsPageLoader,
} from "./pages/TransactionsPage";

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
