import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import SalonFormInput from "../../../shared/SalonFormInput";

const salonServiceSchema = z.object({
  serviceCategoryAr: z.string(),
  serviceCategoryEn: z.string(),
  serviceName: z.string(),
  servicePrice: z.string(),
  salesPercentage: z.string(),
  serviceTime: z.string(),
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
            <SalonFormInput<SalonServiceFormValues>
              label="Service Category (Arabic)"
              register="serviceCategoryAr"
              type="text"
            />
            <SalonFormInput<SalonServiceFormValues>
              label="Service Category (English)"
              register="serviceCategoryEn"
              type="text"
            />
            <SalonFormInput<SalonServiceFormValues>
              label="Service Name"
              register="serviceName"
              type="text"
            />
            <SalonFormInput<SalonServiceFormValues>
              label="Service Price"
              register="servicePrice"
              type="text"
            />
            <SalonFormInput<SalonServiceFormValues>
              label="Sales Percentage"
              register="salesPercentage"
              type="text"
            />
            <SalonFormInput<SalonServiceFormValues>
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
