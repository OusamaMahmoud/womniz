import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import HookFormInput from "../../../shared/SalonFormInput";

const salonServiceSchema = z.object({
  serviceCategoryAr: z.string().min(1, "Service category (Arabic) is required."),
  serviceCategoryEn: z.string().min(1, "Service category (English) is required."),
  serviceName: z.string().min(1, "Service name is required."),
  servicePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Service price must be a valid number."),
  salesPercentage: z.string().regex(/^(100|[1-9]?\d)$/, "Sales percentage must be between 0 and 100."),
  serviceTime: z.string().regex(/^([01]?\d|2[0-3]):([0-5]?\d)$/, "Service time must be in HH:MM format."),
});

type SalonServiceFormValues = z.infer<typeof salonServiceSchema>;

const SalonServiceForm = ({ onClose }: { onClose: () => void }) => {
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
          <h1 className="text-2xl font-semibold mb-4">Add New Service</h1>
          <div className="grid grid-cols-2 gap-x-8">
            <HookFormInput<SalonServiceFormValues>
              label="Service Category (Arabic)"
              register="serviceCategoryAr"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Service Category (English)"
              register="serviceCategoryEn"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Service Name"
              register="serviceName"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Service Price"
              register="servicePrice"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Sales Percentage"
              register="salesPercentage"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Time taken of this service"
              register="serviceTime"
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

export default SalonServiceForm;
