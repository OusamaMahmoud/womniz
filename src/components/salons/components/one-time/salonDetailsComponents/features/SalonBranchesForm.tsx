
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import HookFormInput from "../../../shared/SalonFormInput";

const salonServiceSchema = z.object({
  branchNameAr: z.string().min(1, "Branch name (Arabic) is required."),
  branchNameEn: z.string().min(1, "Branch name (English) is required."),
  street: z.string().min(1, "Street is required."),
  area: z.string().min(1, "Area is required."),
  town: z.string().min(1, "Town is required."),
  location: z.string().min(1, "Location is required."),
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
            <HookFormInput<SalonServiceFormValues>
              label="Branch Name (Arabic)"
              register="branchNameAr"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Branch Name (English)"
              register="branchNameEn"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="street"
              register="street"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="area"
              register="area"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="town"
              register="town"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
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
