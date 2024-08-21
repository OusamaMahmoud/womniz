import React from "react";

const NotFound = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-600 mb-4">
        The page you requested couldn't be found. This might be because:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-10">
        <li>The URL was mistyped</li>
        <li>The page has moved or no longer exists</li>
        <li>You found a broken link</li>
      </ul>
    </div>
  );
};

export default NotFound;
