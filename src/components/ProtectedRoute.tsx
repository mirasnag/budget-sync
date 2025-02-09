import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../store/auth-context";
import { ContextProviders } from "../store/contextProviders";

const ProtectedRoute = () => {
  const { data: user } = useAuthContext(); // Get user from context

  return user ? (
    <ContextProviders>
      <Outlet />
    </ContextProviders>
  ) : (
    <Navigate to="/auth" replace />
  );
};

export default ProtectedRoute;
