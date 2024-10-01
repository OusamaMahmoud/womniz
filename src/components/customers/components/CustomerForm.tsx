import { useForm } from "react-hook-form";
import avatar from "../../../../public/assets/admin/avatar.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import customerService from "../../../services/customer-service";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";

const schema = z.object({
  name: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z\s]*$/),
  email: z.string().email(),
  password: z.string().min(8).max(50),
  birthdate: z.string().date(),
  phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?\d+$/),
  gender: z.enum(["Male", "Female"]),
});

export type FormData = z.infer<typeof schema>;
export type OptionType = { label: string; value: string };

const CustomerForm = ({
  onModalOpen,
}: {
  onModalOpen: (modelState: boolean) => void;
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [creatingCustomerError, setCreatingCustomerError] =
    useState<string>("");
  const [isSubmittinLoading, setSubmitinLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File>({} as File);
  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);

  const notify = () => toast.success("Create Customer Successfully!");
  
  // Handle Photo Create
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  const closeModal = () => {
    onModalOpen(false);
    setPhotoPreview(null);
  };
  const {
    register,
    handleSubmit,
    formState: { errors},
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    formData.append(`email`, data.email);
    formData.append(`name`, data.name);
    formData.append(`password`, data.password);
    formData.append(`phone`, data.phone);
    formData.append(`birthdate`, data.birthdate);
    formData.append(`gender`, data.gender);
    formData.append(`country`, "Egypt");
    formData.append(`status`, "1");
    formData.append(`city`, "");
    formData.append(`addresses`, "");
    formData.append(`image`, imageFile);

    try {
      setSubmitinLoading(true);
      await customerService.create<any>(formData);
      setSubmitinLoading(false);
      onModalOpen(false);
      notify();
      setTrigerFetch(!trigerFetch);
    } catch (error: any) {
      setCreatingCustomerError(error.response.data.data.error);
      setSubmitinLoading(false);
    }
  };

  return (
    <div className="modal modal-open tracking-wide">
      <div className="modal-box max-w-3xl px-10">
        <h3 className="font-bold text-lg text-left">Add Customer</h3>
        <div className="flex justify-center items-center my-8">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-36 h-36 object-cover rounded-full"
            />
          ) : (
            <img src={avatar} alt="" />
          )}
        </div>
        {creatingCustomerError && (
          <p className="text-lg text-red-500 p-2 my-2">
            {creatingCustomerError}
          </p>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-8 ">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <div className="flex  items-center gap-2">
                <input
                  type="text"
                  id="name"
                  className={`input input-bordered  grow ${
                    errors.name && "border-[red]"
                  }`}
                  {...register("name")}
                />
                {errors.name && (
                  <RiErrorWarningLine color="red" className="w-6 h-6 ml-1" />
                )}
              </div>
              {errors.name && (
                <p className="text-[red] text-xs mt-3  ">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date Of Birth</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  id="birthdate"
                  className={`input input-bordered grow ${
                    errors.birthdate && "border-[red]"
                  }`}
                  {...register("birthdate")}
                />

                {errors.birthdate && (
                  <RiErrorWarningLine color="red" className="w-6 h-6 ml-1" />
                )}
              </div>
              {errors.birthdate && (
                <p className="text-[red] text-xs mt-3 ">
                  {errors.birthdate.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="phone"
                  className={`input input-bordered grow ${
                    errors.phone && "border-[red]"
                  } `}
                  {...register("phone")}
                />
                {errors.phone && (
                  <RiErrorWarningLine color="red" className="w-6 h-6 ml-1" />
                )}
              </div>
              {errors.phone && (
                <p className="text-[red] text-xs mt-3 ">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  id="email"
                  className={`input input-bordered ${
                    errors.email && "border-[red]"
                  }  grow`}
                  {...register("email")}
                />
                {errors.email && (
                  <RiErrorWarningLine color="red" className="w-6 h-6 ml-1" />
                )}
              </div>
              {errors.email && (
                <p className="text-[red] text-xs mt-3 ">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="address"
                  className={`select select-bordered grow ${
                    errors.gender && "border-[red]"
                  }`}
                  {...register("gender")}
                >
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                </select>
                {errors.gender && (
                  <RiErrorWarningLine color="red" className="w-6 h-6 ml-1" />
                )}
              </div>
              {errors.gender && (
                <p className="text-[red] text-xs mt-3 ">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  id="password"
                  className={`input input-bordered grow ${
                    errors.email && "border-[red]"
                  }`}
                  {...register("password")}
                />
                {errors.email && (
                  <RiErrorWarningLine color="red" className="w-6 h-6 ml-1" />
                )}
              </div>
              {errors.password && (
                <p className="text-[red] text-xs mt-3 ">
                  {errors.password.message}
                </p>
              )}
            </div>
            <label
              className={`absolute top-[160px] z-100 right-[140px] sm:right-[300px] lg:right-[330px] xl:right-[325px] flex items-center   gap-3 rounded-md   bg-gray-50 cursor-pointer`}
            >
              <span className="text-3xl">
                <FaEdit />
              </span>
              <input
                type="file"
                className="file-input file-input-bordered"
                multiple
                hidden
                name="image"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className="modal-action flex justify-around items-center right-80 ">
            <button
              type="submit"
              className={`btn  bg-[#577656] text-[white] px-10 lg:px-20`}
            >
              {isSubmittinLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                `Save`
              )}
            </button>
            <button
              className={`btn bg-transparent px-10 lg:px-20`}
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
