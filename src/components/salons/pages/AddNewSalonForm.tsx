import { FormProvider, useForm } from "react-hook-form";
import SalonHeader from "../components/reuseable/SalonHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SalonContactInfo from "../components/one-time/SalonContactInfo";
import SalonWorkTime from "../components/one-time/SalonWorkTime";
import SalonDocs from "../components/one-time/SalonDocs";

const SalonSchema = z.object({
  salonNameAr: z.string().min(1, "Salon name (Arabic) is required"),
  salonNameEn: z.string().min(1, "Salon name (English) is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().min(1, "Email is required"),
  country: z.string().min(1, "Country is required"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(1, "Password is required"),
  workStartTime: z
    .date({
      required_error: "Work start time is required",
    })
    .refine((date) => date !== null, {
      message: "Work start time is required",
    }),
  workEndTime: z
    .date({
      required_error: "Work end time is required",
    })
    .refine((date) => date !== null, {
      message: "Work end time is required",
    }),
  workStartDay: z.string().min(1, "Work start day is required"),
  workEndDay: z.string().min(1, "Work end day is required"),
});

export type FormValues = z.infer<typeof SalonSchema>;

const AddNewSalonForm = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(SalonSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="container mx-auto px-4"
      >
        <SalonHeader title="Add New Salon">{""}</SalonHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 mt-8">
          <SalonContactInfo />
          <SalonWorkTime />
        </div>
        <SalonDocs />

        <button
          className="btn bg-[#577656] px-14 text-white mt-4"
          type="submit"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

export default AddNewSalonForm;
