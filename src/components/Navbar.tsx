import * as React from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, X, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface NavbarProps {
  className?: string;
}

const navItems = [
  { label: "HOME", href: "/" },
  { label: "FACULTY", href: "/faculty" },
  { label: "NOTICE", href: "/notice" },
  { label: "EVENT", href: "/event" },
  { label: "RESEARCH", href: "/research-gallery" },
  { label: "ADMISSION", href: "/admission" },
  { label: "CONTACT", href: "/contact" },
];

const additionalNavItems = [
  { label: "SCHEDULE", href: "/schedule" },
  { label: "RESOURCES", href: "/resources" },
  { label: "PROGRAMS", href: "/programs" },
  { label: "COURSES", href: "/courses" },
];

export function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    user,
    logout,
    isAuthenticated,
    setAuthenticationFlag,
    authenticationFlag,
  } = useAuth();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const userEmail = localStorage.getItem("userEmail");
  const userid = parseInt(localStorage.getItem("id") || "0");

  useEffect(() => {
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (id && role && token) {
      setAuthenticationFlag && setAuthenticationFlag(true);
    } else {
      setAuthenticationFlag && setAuthenticationFlag(false);
    }
  }, []);

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleLogout = () => {
    // logout();
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setAuthenticationFlag && setAuthenticationFlag(false);
    navigate("/");
  };

  const handleProfileClick = async () => {
    if (userRole === "faculty") {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch faculty data using the user ID
        const response = await fetch(
          `${import.meta.env.VITE_ENDPOINT}/faculties/user/${userid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (response.ok) {
          const facultyData = await response.json();
          // Navigate to faculty profile with the faculty ID (facultyData.id is the faculty ID)
          navigate(`/faculty/profile/${facultyData.id}`);
        } else {
          // Fallback to regular profile page if API call fails
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        // Fallback to regular profile page on error
        navigate("/profile");
      }
    } else if (userRole === "student") {
      navigate(`/student/profile`);
    } else {
      // For non-faculty users, go to regular profile page
      navigate("/admin/profile");
    }
  };

  return (
    <nav
      className={cn("w-full", className)}
      style={{ backgroundColor: "#14244C" }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Empty for spacing */}
          <div className="flex-1 md:flex-none">{/* Empty space on left */}</div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - Search, Login and Menu */}
          <div className="flex items-center space-x-3 flex-1 justify-end md:flex-none">
            {/* Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-300 hover:bg-white/10 h-8 w-8"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Login/Logout Button (hidden on mobile) */}
            {authenticationFlag ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex text-sm px-6 py-1.5 h-8 font-medium border-0 rounded-sm items-center space-x-2"
                    style={{ backgroundColor: "#ECB31D", color: "#14244C" }}
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.name || user?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                onClick={handleLogin}
                className="hidden md:inline-flex text-sm px-6 py-1.5 h-8 font-medium border-0 rounded-sm"
                style={{ backgroundColor: "#ECB31D", color: "#14244C" }}
              >
                LOG IN
              </Button>
            )}

            {/* Hamburger menu button */}
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-gray-300 hover:bg-white/10 h-8 w-8"
                >
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                  <span className="sr-only">Open main menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2"
                style={{
                  backgroundColor: "#14244C",
                  borderColor: "#374151",
                }}
              >
                {/* Mobile navigation items */}
                <div className="md:hidden">
                  {/* User info when authenticated */}
                  {isAuthenticated && (
                    <>
                      <DropdownMenuItem className="text-white hover:bg-white/10 focus:bg-white/10">
                        <div className="w-full px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {user?.name || user?.email}
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 mt-1">
                            {user?.role?.toUpperCase()}
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <div className="border-t border-gray-600 my-1"></div>
                    </>
                  )}
                  {navItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      <Link
                        to={item.href}
                        className="w-full block px-3 py-2 text-sm font-medium"
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {additionalNavItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      <Link
                        to={item.href}
                        className="w-full block px-3 py-2 text-sm font-medium"
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem className="text-white hover:bg-white/10 focus:bg-white/10">
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full border-0 font-medium rounded-sm"
                        style={{ backgroundColor: "#ECB31D", color: "#14244C" }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        LOGOUT
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleLogin}
                        className="w-full border-0 font-medium rounded-sm"
                        style={{ backgroundColor: "#ECB31D", color: "#14244C" }}
                      >
                        LOG IN
                      </Button>
                    )}
                  </DropdownMenuItem>
                </div>

                {/* Desktop additional menu items */}
                <div className="hidden md:block">
                  {additionalNavItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className="text-white hover:bg-white/10 focus:bg-white/10"
                    >
                      <Link to={item.href} className="w-full">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
