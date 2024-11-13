import  { useState } from "react";
import BulkUpload from "./productsUI-sections/BulkUpload";

const ProductsUI = () => {
  const [, setFile] = useState<File | null>(null);

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
