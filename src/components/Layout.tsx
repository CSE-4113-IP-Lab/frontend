import { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "./Navbar";

export function Layout() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* User Info Bar - Only show when authenticated */}
      {isAuthenticated && user && (
        <div className="bg-gray-100 border-b border-gray-200 px-5 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-semibold">{user.name}</span>
              </div>
              <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                <span className="capitalize">{user.role}</span>
                {user.role === "student" && user.semester && (
                  <span className="ml-1">• Sem {user.semester}</span>
                )}
                {user.studentId && (
                  <span className="ml-1">• {user.studentId}</span>
                )}
                {user.facultyId && (
                  <span className="ml-1">• {user.facultyId}</span>
                )}
              </div>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 hover:text-blue-600 transition-colors text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Account</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white text-black rounded shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-bold text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-xs text-gray-600 capitalize">
                      {user?.role} {user?.studentId && `• ${user.studentId}`}{" "}
                      {user?.facultyId && `• ${user.facultyId}`}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded text-gray-700">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 px-5">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">CONTACT INFO</h3>
            <p className="text-sm mb-2 text-gray-300">
              Department of Computer Science and Engineering
            </p>
            <p className="text-sm mb-2 text-gray-300">University of Dhaka</p>
            <p className="text-sm mb-2 text-gray-300">Dhaka-1000, Bangladesh</p>
            <p className="text-sm text-gray-300">Phone: +88-02-9661900</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">QUICK LINKS</h3>
            <div className="space-y-2">
              <Link
                to="/admission"
                className="block text-sm hover:text-yellow-400 transition-colors text-gray-300">
                Admissions
              </Link>
              <Link
                to="/academics"
                className="block text-sm hover:text-yellow-400 transition-colors text-gray-300">
                Academic Programs
              </Link>
              <Link
                to="/faculty"
                className="block text-sm hover:text-yellow-400 transition-colors text-gray-300">
                Faculty Directory
              </Link>
              <Link
                to="/events"
                className="block text-sm hover:text-yellow-400 transition-colors text-gray-300">
                Events
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">RESOURCES</h3>
            <div className="space-y-2">
              <Link
                to="/schedule"
                className="block text-sm hover:text-yellow-400 transition-colors text-gray-300">
                Class Schedule
              </Link>
              <Link
                to="/assignments"
                className="block text-sm hover:text-yellow-400 transition-colors text-gray-300">
                Assignments
              </Link>
              <Link
                to="/grades"
                className="block text-sm hover:text-yellow-400 transition-colors text-gray-300">
                Grades
              </Link>
              <Link
                to="/lab-booking"
                className="block text-sm hover:text-yellow-400 transition-colors text-gray-300">
                Lab Booking
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm">
          <p className="text-gray-300">
            &copy; 2025 Department of Computer Science and Engineering,
            University of Dhaka. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
