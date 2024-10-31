import { LinkIcon } from "@heroicons/react/24/solid";
import { Link2Icon } from "lucide-react";
import React, { ReactNode } from "react";
import { BiLink } from "react-icons/bi";
import { IoAddCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
interface FeatureProps {
  featureHeader: string;
  link: string;
  children: ReactNode;
  handleOpenDialogModel: () => void;
}

const SalonFeatures = ({
  featureHeader,
  link,
  children,
  handleOpenDialogModel,
}: FeatureProps) => {
  return (
    <div className="border max-w-[770px] shadow-md mt-8 p-4  rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold capitalize ">{featureHeader}</h1>
        <Link to={`${link}`} className="link text-sm flex items-center gap-1">
         <BiLink /> View Details
        </Link>
      </div>
      <div className="my-8">{children}</div>
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
