import * as React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  className?: string;
}

const navItems = [
  { label: "HOME", href: "/" },
  { label: "NOTICE", href: "/notice" },
  { label: "EVENT", href: "/event" },
  { label: "CONTACT", href: "/contact" },
  { label: "SCHEDULE", href: "/schedule" },
];

const additionalNavItems = [
  { label: "Academics", href: "/academics" },
  { label: "Research", href: "/research" },
  { label: "Admissions", href: "/admissions" },
  { label: "Faculty", href: "/faculty" },
  { label: "Schedule", href: "/schedule" },
];

export function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, isAuthenticated } = useAuth();

  // Add admin link for admin users
  const navItemsWithAdmin = React.useMemo(() => {
    const items = [...navItems];
    if (isAuthenticated && user?.role === "admin") {
      items.push({ label: "ADMIN", href: "/admin" });
    }
    return items;
  }, [isAuthenticated, user?.role]);

  return (
    <nav
      className={cn("w-full", className)}
      style={{ backgroundColor: "#14244C" }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Empty for spacing */}
          <div className="flex-1 md:flex-none">{/* Empty space on left */}</div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
            {navItemsWithAdmin.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200">
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
              className="text-white hover:text-gray-300 hover:bg-white/10 h-8 w-8">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Login Button (hidden on mobile) */}
            <Button
              variant="outline"
              className="hidden md:inline-flex text-sm px-6 py-1.5 h-8 font-medium border-0 rounded-sm"
              style={{ backgroundColor: "#ECB31D", color: "#14244C" }}>
              LOG IN
            </Button>

            {/* Hamburger menu button */}
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-gray-300 hover:bg-white/10 h-8 w-8">
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
                }}>
                {/* Mobile navigation items */}
                <div className="md:hidden">
                  {navItemsWithAdmin.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className="text-white hover:bg-white/10 focus:bg-white/10">
                      <Link
                        to={item.href}
                        className="w-full block px-3 py-2 text-sm font-medium">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {additionalNavItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className="text-white hover:bg-white/10 focus:bg-white/10">
                      <Link
                        to={item.href}
                        className="w-full block px-3 py-2 text-sm font-medium">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem className="text-white hover:bg-white/10 focus:bg-white/10">
                    <Button
                      variant="outline"
                      className="w-full border-0 font-medium rounded-sm"
                      style={{ backgroundColor: "#ECB31D", color: "#14244C" }}>
                      LOG IN
                    </Button>
                  </DropdownMenuItem>
                </div>

                {/* Desktop additional menu items */}
                <div className="hidden md:block">
                  {additionalNavItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className="text-white hover:bg-white/10 focus:bg-white/10">
                      <Link to={item.href} className="w-full">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem className="text-white hover:bg-white/10 focus:bg-white/10">
                    <Link to="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/10 focus:bg-white/10">
                    <Link to="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/10 focus:bg-white/10">
                    <Link to="/help" className="w-full">
                      Help
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Notice Bar */}
        <div className="bg-gray-200 text-gray-800 px-4 py-2 text-sm border-t border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-700">
                Notice !!! Shawon got cgpa -4 in semester 4-1
              </span>
              <ChevronRight className="h-4 w-4 ml-2 text-gray-600" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-gray-600 hover:text-gray-800 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
