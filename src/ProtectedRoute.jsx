// components/ProtectedRoute.jsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./components/hooks/auth";

const ProtectedRoute = ({ redirectTo = "/login" }) => {
  const { user, isAuthenticated, isLoadingUser } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoadingUser) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/session_logo.png"
            alt="Loading"
            className="animate-pulse w-16"
          />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login with the current location
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  if (!user.isEmailVerified) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Email Verification Required
          </h2>
          <p className="text-yellow-700 mb-4">
            Please verify your email address to access this page.
          </p>
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            onClick={() => (window.location.href = "/verify-email")}
          >
            Verify Email
          </button>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the protected component
  return <Outlet />;
};

export default ProtectedRoute;
