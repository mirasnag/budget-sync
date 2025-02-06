import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../store/auth-context";

const ProtectedRoute = () => {
  const { data: user } = useAuthContext(); // Get user from context

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
