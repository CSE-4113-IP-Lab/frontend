import React from "react";
import { useAuth, UserRole } from "../contexts/AuthContext";
import Card from "./Card";
import Button from "./Button";
import { Shield, Lock, AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  courseCode?: string;
  fallbackMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  courseCode,
  fallbackMessage,
}) => {
  const { user, isAuthenticated, hasAnyRole, canAccessCourse } = useAuth();

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="px-5 py-12">
        <Card cornerStyle="tl" className="max-w-md mx-auto text-center">
          <Lock className="w-16 h-16 text-primary-yellow mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary-dark mb-4">
            AUTHENTICATION REQUIRED
          </h2>
          <p className="text-text-secondary mb-6">
            Please log in to access this page. You need valid credentials to
            continue.
          </p>
          <Button
            cornerStyle="br"
            onClick={() => (window.location.href = "/login")}>
            GO TO LOGIN
          </Button>
        </Card>
      </div>
    );
  }

  // Role-based access control
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return (
      <div className="px-5 py-12">
        <Card cornerStyle="tl" className="max-w-md mx-auto text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary-dark mb-4">
            ACCESS DENIED
          </h2>
          <p className="text-text-secondary mb-4">
            {fallbackMessage ||
              `This page requires ${requiredRoles.join(" or ")} access level.`}
          </p>
          <p className="text-sm text-text-secondary mb-6">
            Your current role:{" "}
            <span className="font-bold text-primary-dark">
              {user.role?.toUpperCase()}
            </span>
          </p>
          <Button
            variant="outline"
            cornerStyle="bl"
            onClick={() => window.history.back()}>
            GO BACK
          </Button>
        </Card>
      </div>
    );
  }

  // Course-specific access control
  if (courseCode && !canAccessCourse(courseCode)) {
    return (
      <div className="px-5 py-12">
        <Card cornerStyle="tl" className="max-w-md mx-auto text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary-dark mb-4">
            COURSE ACCESS RESTRICTED
          </h2>
          <p className="text-text-secondary mb-4">
            You don't have access to course{" "}
            <span className="font-bold">{courseCode}</span>.
          </p>
          <p className="text-sm text-text-secondary mb-6">
            Only enrolled students and assigned faculty can access course
            materials.
          </p>
          <Button
            variant="outline"
            cornerStyle="bl"
            onClick={() => window.history.back()}>
            GO BACK
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
