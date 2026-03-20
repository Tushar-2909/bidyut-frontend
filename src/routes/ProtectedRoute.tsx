import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // ------------------------------
  // LOADING STATE
  // ------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ------------------------------
  // NOT AUTHENTICATED
  // ------------------------------
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ------------------------------
  // ROLE-BASED ACCESS CONTROL 🔥
  // ------------------------------
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on actual role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "user") {
      return <Navigate to="/dashboard" replace />;
    }

    // Fallback (rare edge case)
    return <Navigate to="/login" replace />;
  }

  // ------------------------------
  // AUTHORIZED
  // ------------------------------
  return <>{children}</>;
}