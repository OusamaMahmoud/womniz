import React from "react";
import { IoAddCircle } from "react-icons/io5";
interface FeatureProps {
  featureHeader: string;
  handleOpenDialogModel: () => void;
}

const SalonFeatures = ({
  featureHeader,
  handleOpenDialogModel,
}: FeatureProps) => {
  return (
    <div className="border max-w-[770px] shadow-md mt-8 p-4  rounded-md">
      <h1 className="text-xl font-semibold capitalize ">{featureHeader}</h1>
      <button
        onClick={handleOpenDialogModel}
        className="badge badge-outline text-lg mt-4 gap-2 p-4 bg-base-200 ml-6"
      >
        <IoAddCircle /> Add {featureHeader}s
      </button>
    </div>
  );
};

export default SalonFeatures;
