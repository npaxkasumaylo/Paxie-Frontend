import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4">
     <div className="mb-8">
        <svg
          className="w-32 h-32 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-7xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        404
      </h1>

      <h2 className="text-3xl font-bold text-slate-800 mb-4">Page Not Found</h2>

      <p className="text-md text-slate-600 text-center mb-2 max-w-lg">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Go to NPAX Webiste
        </Link>
      </div>

      <p className="mt-12 text-xs text-slate-500">
        Need help? <Link to="/" className="text-blue-500 hover:text-blue-600 font-semibold">Contact Support</Link>
      </p>
    </div>
  );
}
