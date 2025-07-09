import { Link } from "react-router";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="w-full py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#14244C" }}>
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Footer Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8">
            <Link
              to="/privacy-policy"
              className="text-white hover:text-gray-300 text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-white hover:text-gray-300 text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link
              to="/accessibility"
              className="text-white hover:text-gray-300 text-sm transition-colors duration-200">
              Accessibility
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center space-x-4">
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright Text */}
          <div className="text-center">
            <p className="text-white text-sm">
              © 2023 Department of Computer Science and Engineering, University
              of Dhaka. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
