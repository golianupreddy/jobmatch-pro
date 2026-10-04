import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
