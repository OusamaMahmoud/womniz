// LoadingModal.tsx
import React from "react";
import { useLoading } from "../contexts/LoadingContext";

const LoadingModal: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-[9999]">
      <div className="bg-white p-6 rounded-md shadow-md flex flex-col items-center">
        <div className="loader border-t-blue-500 w-12 h-12 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingModal;
