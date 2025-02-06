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
import AuthPage from "./pages/AuthPage";

// helper functions
import { ContextProviders } from "./store/contextProviders";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <Dashboard />, loader: dashboardLoader },
          {
            path: "/transactions",
            element: <TransactionsPage />,
            loader: transactionsPageLoader,
          },
          {
            path: "/spending-analysis",
            element: <SpendingAnalysisPage />,
            loader: spendingAnalysisLoader,
          },
        ],
      },
      {
        path: "/auth",
        element: <AuthPage />,
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
