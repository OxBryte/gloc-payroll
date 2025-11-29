// components/ProtectedRoute.jsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./components/hooks/auth";

const ProtectedRoute = ({ redirectTo = "/login" }) => {
  const { isAuthenticated, isLoadingUser, error } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoadingUser) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-c-bg2">
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/loading.svg"
            alt="Loading"
            className="animate-pulse w-16"
          />
          <div className="w-6 h-6 border-2 border-c-color border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // If user is not authenticated or token validation failed, redirect to login
  if (!isAuthenticated || error) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated, render the protected component
  return <Outlet />;
};

export default ProtectedRoute;
