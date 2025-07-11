import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, Bell, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Base navigation items (always visible)
  const baseNavItems = [
    { name: "HOME", path: "/" },
    { name: "FACULTY", path: "/faculty" },
    { name: "ACADEMICS", path: "/academics" },
    { name: "ADMISSIONS", path: "/admissions" },
    { name: "CONTACT", path: "/contact" },
  ];

  // Authenticated user navigation items
  const authenticatedNavItems = [
    { name: "SCHEDULE", path: "/schedule" },
    { name: "NOTICES", path: "/notices" },
    { name: "EVENTS", path: "/events" },
  ];

  // Student & Faculty navigation items
  const studentFacultyNavItems = [
    { name: "ASSIGNMENTS", path: "/assignments" },
    { name: "GRADES", path: "/grades" },
    { name: "EXAM SCHEDULE", path: "/exam-schedule" },
    { name: "PROJECTS", path: "/projects" },
  ];

  // Faculty & Admin navigation items
  const facultyAdminNavItems = [
    { name: "MEETINGS", path: "/meetings" },
    { name: "ACHIEVEMENTS", path: "/achievements" },
  ];

  // Admin only navigation items
  const adminNavItems = [
    { name: "ROOM BOOKING", path: "/room-booking" },
    { name: "LAB BOOKING", path: "/lab-booking" },
    { name: "FEES", path: "/fees" },
  ];

  // Build navigation items based on user role
  const getNavigationItems = () => {
    let items = [...baseNavItems];

    if (isAuthenticated) {
      items = [...items, ...authenticatedNavItems];

      if (
        user?.role === "student" ||
        user?.role === "faculty" ||
        user?.role === "admin"
      ) {
        items = [...items, ...studentFacultyNavItems];
      }

      if (user?.role === "faculty" || user?.role === "admin") {
        items = [...items, ...facultyAdminNavItems];
      }

      if (user?.role === "admin") {
        items = [...items, ...adminNavItems];
      }
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="max-w-site mx-auto">
      {/* Header */}
      <header className="bg-primary-dark text-white">
        <div className="px-5">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4 border-b border-gray-600">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">CSEDU</h1>
              <span className="hidden md:block text-sm">
                Department of Computer Science and Engineering
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Search className="w-6 h-6 cursor-pointer hover:text-primary-yellow transition-colors" />
              {isAuthenticated && (
                <Bell className="w-6 h-6 cursor-pointer hover:text-primary-yellow transition-colors" />
              )}

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 hover:text-primary-yellow transition-colors">
                    <User className="w-6 h-6" />
                    <span className="font-bold text-sm hidden md:block">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white text-black rounded-tl shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-bold text-primary-dark">
                          {user?.name}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {user?.email}
                        </p>
                        <p className="text-xs text-text-secondary capitalize">
                          {user?.role}{" "}
                          {user?.studentId && `• ${user.studentId}`}{" "}
                          {user?.facultyId && `• ${user.facultyId}`}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 hover:text-primary-yellow transition-colors">
                  <User className="w-6 h-6" />
                  <span className="font-bold text-sm">LOG IN</span>
                </Link>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="py-4">
            <div className="flex items-center justify-between">
              <div className="hidden lg:flex">
                <NavigationMenu>
                  <NavigationMenuList className="space-x-2">
                    {navigationItems.map((item) => (
                      <NavigationMenuItem key={item.name}>
                        <Link
                          to={item.path}
                          className={`inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors text-white bg-[#1E2A44] hover:text-primary-yellow hover:bg-primary-yellow/10 focus:bg-primary-yellow/10 focus:text-primary-yellow focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                            isActivePath(item.path) ? "text-primary-yellow bg-primary-yellow/20" : ""
                          }`}>
                          {item.name}
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <div className="hidden lg:flex items-center space-x-4">
                {isAuthenticated && user && (
                  <div className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded">
                    <span className="capitalize">{user.role}</span>
                    {user.role === "student" && user.semester && (
                      <span className="ml-1">• Sem {user.semester}</span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex items-center">
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="lg:hidden mt-4 pb-4 border-t border-gray-600 pt-4">
                {isAuthenticated && user && (
                  <div className="mb-4 p-3 bg-gray-700 rounded text-center">
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className="text-xs text-gray-300 capitalize">
                      {user.role}
                      {user.role === "student" &&
                        user.semester &&
                        ` • Semester ${user.semester}`}
                      {user.role === "student" &&
                        user.studentId &&
                        ` • ${user.studentId}`}
                      {user.role === "faculty" &&
                        user.facultyId &&
                        ` • ${user.facultyId}`}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  {/* Base Navigation */}
                  <div className="mb-3">
                    <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                      General
                    </h4>
                    {baseNavItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block font-bold text-sm hover:text-primary-yellow transition-colors py-2 pl-2 ${
                          isActivePath(item.path) ? "text-primary-yellow" : ""
                        }`}
                        onClick={() => setIsMenuOpen(false)}>
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Authenticated Navigation */}
                  {isAuthenticated && (
                    <>
                      <div className="mb-3">
                        <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                          Dashboard
                        </h4>
                        {authenticatedNavItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className={`block font-bold text-sm hover:text-primary-yellow transition-colors py-2 pl-2 ${
                              isActivePath(item.path)
                                ? "text-primary-yellow"
                                : ""
                            }`}
                            onClick={() => setIsMenuOpen(false)}>
                            {item.name}
                          </Link>
                        ))}
                      </div>

                      {/* Student/Faculty Navigation */}
                      {(user?.role === "student" ||
                        user?.role === "faculty" ||
                        user?.role === "admin") && (
                        <div className="mb-3">
                          <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                            Academic
                          </h4>
                          {studentFacultyNavItems.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className={`block font-bold text-sm hover:text-primary-yellow transition-colors py-2 pl-2 ${
                                isActivePath(item.path)
                                  ? "text-primary-yellow"
                                  : ""
                              }`}
                              onClick={() => setIsMenuOpen(false)}>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Faculty/Admin Navigation */}
                      {(user?.role === "faculty" || user?.role === "admin") && (
                        <div className="mb-3">
                          <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                            Management
                          </h4>
                          {facultyAdminNavItems.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className={`block font-bold text-sm hover:text-primary-yellow transition-colors py-2 pl-2 ${
                                isActivePath(item.path)
                                  ? "text-primary-yellow"
                                  : ""
                              }`}
                              onClick={() => setIsMenuOpen(false)}>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Admin Navigation */}
                      {user?.role === "admin" && (
                        <div className="mb-3">
                          <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                            Admin
                          </h4>
                          {adminNavItems.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className={`block font-bold text-sm hover:text-primary-yellow transition-colors py-2 pl-2 ${
                                isActivePath(item.path)
                                  ? "text-primary-yellow"
                                  : ""
                              }`}
                              onClick={() => setIsMenuOpen(false)}>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-8 px-5">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">CONTACT INFO</h3>
            <p className="text-sm mb-2">
              Department of Computer Science and Engineering
            </p>
            <p className="text-sm mb-2">University of Dhaka</p>
            <p className="text-sm mb-2">Dhaka-1000, Bangladesh</p>
            <p className="text-sm">Phone: +88-02-9661900</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">QUICK LINKS</h3>
            <div className="space-y-2">
              <Link
                to="/admissions"
                className="block text-sm hover:text-primary-yellow transition-colors">
                Admissions
              </Link>
              <Link
                to="/academics"
                className="block text-sm hover:text-primary-yellow transition-colors">
                Academic Programs
              </Link>
              <Link
                to="/faculty"
                className="block text-sm hover:text-primary-yellow transition-colors">
                Faculty Directory
              </Link>
              <Link
                to="/events"
                className="block text-sm hover:text-primary-yellow transition-colors">
                Events
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">RESOURCES</h3>
            <div className="space-y-2">
              <Link
                to="/schedule"
                className="block text-sm hover:text-primary-yellow transition-colors">
                Class Schedule
              </Link>
              <Link
                to="/assignments"
                className="block text-sm hover:text-primary-yellow transition-colors">
                Assignments
              </Link>
              <Link
                to="/grades"
                className="block text-sm hover:text-primary-yellow transition-colors">
                Grades
              </Link>
              <Link
                to="/lab-booking"
                className="block text-sm hover:text-primary-yellow transition-colors">
                Lab Booking
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm">
          <p>
            &copy; 2025 Department of Computer Science and Engineering,
            University of Dhaka. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
