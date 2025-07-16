import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Resources() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Auto-redirect based on authenticated user role
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (loading) {
      return; // Wait for auth to load
    }

    // if (!isAuthenticated) {
    //   console.log("Not authenticated, redirecting to auth");
    //   navigate("/auth");
    //   return;
    // }

    // Redirect to appropriate resources page based on user role
    console.log("User role:", role);
    if (role === "admin") {
      console.log("Redirecting to admin resources");
      navigate("/resources/admin");
    } else if (role === "faculty") {
      console.log("Redirecting to faculty resources");
      navigate("/resources/faculty");
    } else if (role === "student") {
      console.log("Redirecting to student resources");
      navigate("/resources/student");
    } else {
      // Default to student resources for other roles
      console.log("Unknown role, defaulting to student resources");
      navigate("/resources/student");
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while checking auth or redirecting
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                University Resources
              </h1>
              <p className="text-gray-600">
                Loading your authentication status...
              </p>
            </div>
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Checking authentication...</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              University Resources
            </h1>
            <p className="text-gray-600">
              Redirecting you to your role-specific resources...
            </p>
          </div>

          {/* Loading Card */}
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your resources...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
