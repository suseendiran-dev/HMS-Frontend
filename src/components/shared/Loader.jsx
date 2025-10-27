import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="text-center">
        <div className="relative inline-flex">
          <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-r-blue-600 rounded-full animate-spin animation-delay-200"></div>
        </div>
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
