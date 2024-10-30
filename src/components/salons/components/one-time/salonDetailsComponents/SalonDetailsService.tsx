import { useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import SalonDetailsDialog from "./SalonDetailsDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SalonFormInput from "../../shared/SalonFormInput";

const serviceSchema = z.object({
  serviceCategoryEn: z.string(),
  serviceCategoryAr: z.string(),
});

type SalonServiceFormValues = z.infer<typeof serviceSchema>;
const SalonDetailsService = () => {
  const [isDialogShown, setDialogShown] = useState(false);

  return (
    <div className="max-w-3xl mt-4 border p-10 rounded-lg">
      <h1 className="text-2xl font-semibold mb-2">Service</h1>
      <div
        onClick={() => setDialogShown(true)}
        className="flex gap-2 items-center bg-base-200 p-3 shadow-lg border w-fit rounded-md"
      >
        <IoAddCircle className="text-xl" />
        <p className="text-xl font-bold ">Add Service</p>
      </div>
      {isDialogShown && (
        <SalonDetailsDialog header="Add Salon Service" id="1">
          <SalonFormInput<SalonServiceFormValues>
            type="text"
            label="Service Category (arabic)"
            register={'serviceCategoryAr'}
          />
          <SalonFormInput<SalonServiceFormValues>
            type="text"
            label="Service Category (English)"
            register={'serviceCategoryEn'}
          />
        </SalonDetailsDialog>
      )}
    </div>
  );
};

export default SalonDetailsService;
