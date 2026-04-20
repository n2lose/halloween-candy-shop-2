import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import Spinner from "../ui/Spinner";

type ProtectedRouteProps = {
  role?: "admin" | "customer";
  children: ReactNode;
};

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/products"} replace />;
  }

  return <>{children}</>;
}
