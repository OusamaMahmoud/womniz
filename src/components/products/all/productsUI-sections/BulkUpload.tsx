import React from "react";
import { BiUpload } from "react-icons/bi";

const BulkUpload = ({
  onBulkUpload,
}: {
  onBulkUpload: (file: File) => void;
}) => {
  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onBulkUpload(file);
      // Reset the input value to allow re-selecting the same file
      e.target.value = "";
    }
  };
  return (
    <div className="flex items-center gap-8 justify-end mb-8">
      <label
        htmlFor="excel"
        className="flex gap-2 items-center text-white bg-[#577656] hover:text-black btn xl:px-12 xl:text-lg"
      >
        <BiUpload /> Bulk Upload
        <input
          id="excel"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleBulkUpload}
          hidden
        />
      </label>
    </div>
  );
};

export default BulkUpload;
