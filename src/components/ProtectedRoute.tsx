import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export type UserRole = "student" | "faculty" | "admin" | "staff" | null;

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallbackMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackMessage,
}) => {
  const location = useLocation();
  const role = localStorage.getItem("role") as UserRole | null;

  // Not authenticated
  if (!role) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Role check
  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <strong className="font-bold">Access Denied!</strong>
            <span className="block sm:inline">
              {fallbackMessage ||
                "You don't have permission to access this page."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// 🔒 Role-specific shortcuts
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRoles={["admin", "staff"]}>{children}</ProtectedRoute>
);

export const StudentRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute requiredRoles={["student"]}>{children}</ProtectedRoute>;

export const FacultyRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute requiredRoles={["faculty"]}>{children}</ProtectedRoute>;

export const StudentOrFacultyRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRoles={["student", "faculty"]}>
    {children}
  </ProtectedRoute>
);

export const AdminOrFacultyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'staff', 'faculty']}>{children}</ProtectedRoute>
);
