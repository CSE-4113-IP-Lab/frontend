import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "@/services/authService";

export type UserRole = "student" | "faculty" | "admin" | "staff" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccessCourse: (courseCode: string) => boolean;
  loading: boolean;
  setIsAuthenticated?: (isAuthenticated: boolean) => void; // Optional setter for isAuthenticated
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved authentication state
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      // Get the stored email from localStorage (could be from login or signup)
      const storedEmail =
        localStorage.getItem("email") ||
        localStorage.getItem("userEmail") ||
        "";

      setUser({
        id: currentUser.id,
        name: storedEmail.split("@")[0] || "User", // Use email prefix as name
        email: storedEmail,
        role: currentUser.role as UserRole,
        token: currentUser.token,
      });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("AuthContext: Starting login process", { email }); // Debug log
      setLoading(true);
      const response = await authService.login({ email, password });
      console.log("AuthContext: Login response received", response); // Debug log

      const newUser: User = {
        id: response.user_id.toString(),
        name: response.email.split("@")[0], // Use email prefix as name
        email: response.email,
        role: response.user_role as UserRole,
        token: response.access_token,
      };

      console.log("AuthContext: Setting user", newUser); // Debug log
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("email", response.email);

      return true;
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(user?.role || null);
  };

  const canAccessCourse = (_courseCode: string): boolean => {
    // Simple course access logic - can be expanded later
    return isAuthenticated;
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    canAccessCourse,
    loading,
    setIsAuthenticated, // Optional setter for isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
