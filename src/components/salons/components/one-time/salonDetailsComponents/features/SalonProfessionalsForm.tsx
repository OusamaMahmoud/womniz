import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import HookFormInput from "../../../shared/SalonFormInput";

const salonServiceSchema = z.object({
  fullNameAr: z.string().min(1, "Arabic full name is required"),
  fullNameEn: z.string().min(1, "English full name is required"),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Age must be a positive number",
  }),
  headline: z.string().min(5, "Headline should be at least 5 characters"),
  serviceCategory: z.string().min(1, "Service category is required"),
  location: z.string().min(1, "Location is required"),
  area: z.string().min(1, "Area is required"),
  town: z.string().min(1, "Town is required"),
  serviceName: z.string().min(1, "Service name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  workStartDay: z.string().min(1, "Work start day is required"),
  workEndDay: z.string().min(1, "Work end day is required"),
  workStartTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Invalid start time format (use HH:MM 24-hour format)"
    ),
  workEndTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Invalid end time format (use HH:MM 24-hour format)"
    ),
  facebook: z.string().url("Invalid URL").optional(),
  instagram: z.string().url("Invalid URL").optional(),
});

type SalonServiceFormValues = z.infer<typeof salonServiceSchema>;

const SalonProfessionalsForm = ({ onClose }: { onClose: () => void }) => {
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
              label="Full Name (Arabic)"
              register="fullNameAr"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Full Name (English)"
              register="fullNameEn"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Age"
              register="age"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Headline"
              register="headline"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Service Category"
              register="serviceCategory"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Service Name"
              register="serviceName"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Email"
              register="email"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="Password"
              register="password"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="work start day"
              register="workStartDay"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="work end day"
              register="workEndDay"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="work start time"
              register="workStartTime"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="work end time"
              register="workEndTime"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="facebook"
              register="facebook"
              type="text"
            />
            <HookFormInput<SalonServiceFormValues>
              label="instagram"
              register="instagram"
              type="text"
            />
          </div>
          <div className="flex gap-4 items-center">
            <button
              className="btn bg-womnizColor text-white px-8 mt-4"
              type="submit"
            >
              Submit
            </button>
            <button type="button" onClick={onClose} className="btn px-8 mt-4">
              Close
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default SalonProfessionalsForm;
