// rrd imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// components
import Layout from "./components/Layout";

// pages
import Dashboard, { dashboardLoader } from "./pages/Dashboard";
import TransactionsPage, {
  transactionsPageLoader,
} from "./pages/TransactionsPage";
import SpendingAnalysisPage, {
  spendingAnalysisLoader,
} from "./pages/SpendingAnalysisPage";
import ErrorPage from "./pages/Error";
import Contact, { contactAction } from "./pages/Contact";

// helper functions
import { ContextProviders } from "./store/contextProviders";

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
        errorElement: <ErrorPage />,
      },
      {
        path: "/transactions",
        element: <TransactionsPage />,
        loader: transactionsPageLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: "/spending-analysis",
        element: <SpendingAnalysisPage />,
        loader: spendingAnalysisLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: "/contact",
        element: <Contact />,
        action: contactAction,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ContextProviders>
        <RouterProvider router={router} />
      </ContextProviders>
    </>
  );
}

export default App;
