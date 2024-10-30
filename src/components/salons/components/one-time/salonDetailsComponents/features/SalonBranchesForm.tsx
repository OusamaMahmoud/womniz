
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import SalonFormInput from "../../../shared/SalonFormInput";

const salonServiceSchema = z.object({
  branchNameAr: z.string(),
  branchNameEn: z.string(),
  street: z.string(),
  area: z.string(),
  town: z.string(),
  location: z.string(),
});

type SalonServiceFormValues = z.infer<typeof salonServiceSchema>;

const SalonBranchesForm = ({ onClose }: { onClose: () => void }) => {
  const methods = useForm<SalonServiceFormValues>({
    resolver: zodResolver(salonServiceSchema),
  });

  const onSubmit = (data: SalonServiceFormValues) => {
    console.log(data); // This should log form data on successful submission
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-semibold mb-4">Add New Branch</h1>
          <div className="grid grid-cols-2 gap-x-8">
            <SalonFormInput<SalonServiceFormValues>
              label="Branch Name (Arabic)"
              register="branchNameAr"
              type="text"
            />
            <SalonFormInput<SalonServiceFormValues>
              label="Branch Name (English)"
              register="branchNameEn"
              type="text"
            />
            <SalonFormInput<SalonServiceFormValues>
              label="street"
              register="street"
              type="text"
            />
            <SalonFormInput<SalonServiceFormValues>
              label="area"
              register="area"
              type="text"
            />
            <SalonFormInput<SalonServiceFormValues>
              label="town"
              register="town"
              type="text"
            />
            <SalonFormInput<SalonServiceFormValues>
              label="location"
              register="location"
              type="text"
            />
          </div>
          <div className="flex gap-4 items-center">
            <button className="btn bg-womnizColor text-white px-8 mt-4" type="submit">
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn px-8 mt-4"
            >
              Close
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default SalonBranchesForm;
