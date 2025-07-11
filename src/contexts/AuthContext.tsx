import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";

export type UserRole = "student" | "faculty" | "admin" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  facultyId?: string;
  department?: string;
  semester?: string;
  batch?: string;
  courses?: string[]; // Courses taught (faculty) or enrolled (student)
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccessCourse: (courseCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: { [key: string]: User } = {
  "student@csedu.du.ac.bd": {
    id: "1",
    name: "Fatima Khan",
    email: "student@csedu.du.ac.bd",
    role: "student",
    studentId: "2021-1-60-001",
    department: "Computer Science and Engineering",
    semester: "7th",
    batch: "2021",
    courses: ["CSE 425", "CSE 301", "CSE 201", "CSE 401", "CSE 101"],
  },
  "faculty@csedu.du.ac.bd": {
    id: "2",
    name: "Dr. Mohammad Rahman",
    email: "faculty@csedu.du.ac.bd",
    role: "faculty",
    facultyId: "CSE-001",
    department: "Computer Science and Engineering",
    courses: ["CSE 425", "CSE 471", "CSE 472"],
  },
  "admin@csedu.du.ac.bd": {
    id: "3",
    name: "Ahmed Hassan",
    email: "admin@csedu.du.ac.bd",
    role: "admin",
    department: "Computer Science and Engineering",
    courses: [], // Admin has access to all courses
  },
  "faculty2@csedu.du.ac.bd": {
    id: "4",
    name: "Dr. Sarah Ahmed",
    email: "faculty2@csedu.du.ac.bd",
    role: "faculty",
    facultyId: "CSE-002",
    department: "Computer Science and Engineering",
    courses: ["CSE 401", "CSE 471", "CSE 472"],
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved authentication state
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const mockUser = mockUsers[email];

    if (mockUser && password === "password123") {
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(user?.role || null);
  };

  const canAccessCourse = (courseCode: string): boolean => {
    if (!user) return false;

    // Admin can access all courses
    if (user.role === "admin") return true;

    // Check if user is enrolled in or teaches the course
    return user.courses?.includes(courseCode) || false;
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    canAccessCourse,
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
