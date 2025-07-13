import React from "react";
import { Link } from "react-router";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 text-red-600 p-4 rounded-full">
            <ExclamationTriangleIcon className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-900 text-white rounded-md shadow-md hover:bg-blue-800 transition">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
