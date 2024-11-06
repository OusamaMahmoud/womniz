import React, { useState } from "react";
import { BiUpload } from "react-icons/bi";
import BulkUpload from "./productsUI-sections/BulkUpload";
import useProducts from "../../../hooks/useProducts";
import useDeleteProducts from "../../../hooks/useDeleteProducts";

const ProductsUI = () => {
  const [file, setFile] = useState<File | null>(null);

  // Bulk Upload!!
  const handleBulkUpload = (file: File) => {
    setFile(file);
  };

  return (
    <div className="px-6">
      <div className="flex flex-col">
        <BulkUpload onBulkUpload={handleBulkUpload} />
      </div>
    </div>
  );
};

export default ProductsUI;
