import React, { useState } from "react";
import adminsService from "../../services/admins-service";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import avatar from "/assets/admin/avatar.svg";
import useRoles from "../../hooks/useRoles";

const schema = z.object({
  name: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z\s]*$/),
  email: z.string().email(),
  password: z.string().min(8).max(50),
  birthdate: z.string().date(),
  address: z.string().min(3).max(255),
  phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?\d+$/),
  status: z.enum(["0", "1"]).default("0"),
  country_id: z.enum(["2", "1"]).default("2"),
  role: z.string().min(3, { message: "Role Must Be Selected!" }),
});

export type FormData = z.infer<typeof schema>;
export type OptionType = { label: string; value: string };
const AdminForm = ({
  onModalOpen,
  onRefresh,
}: {
  onModalOpen: (modelState: boolean) => void;
  onRefresh: () => void;
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [creatingAdminError, setCreatingAdminError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>({} as File);
  const [isSubmittinLoading, setSubmitinLoading] = useState<boolean>(false);
  const { roles } = useRoles();

  const {
    register,
    handleSubmit,
  
    reset,
    formState: { errors},
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const notify = () => toast.success("Create Admin Successfully!");

  const getDefaultImageFile = async () => {
    // Create a default image file (you can use any default image file)
    // For example, create a new File object with a default image URL
    const defaultImageUrl = "https://placehold.co/100x100";
    const defaultImageFileName = "default-image.png";
    try {
      const response = await fetch(defaultImageUrl);
      const blob = await response.blob();
      return new File([blob], defaultImageFileName, { type: "image/png" });
    } catch (error: any) {
      throw new Error("Failed to fetch default image: " + error.message);
    }
  };
  // const openModal = () => {
  //   onModalOpen(true);
  // };

  const closeModal = () => {
    onModalOpen(false);
    setPhotoPreview(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // If a file is uploaded
      const file = e.target.files[0];
      setImageFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // const { categories } = useCategories();
  // const options: OptionType[] = categories.map((item) => ({
  //   label: item.title,
  //   value: item.title,
  // }));

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    formData.append(`address`, data.address);
    formData.append(`birthdate`, data.birthdate);
    formData.append(`country_id`, data.country_id);
    formData.append(`email`, data.email);
    formData.append(`name`, data.name);
    formData.append(`password`, data.password);
    formData.append(`phone`, data.phone);
    formData.append(`status`, data.status);
    formData.append(`role`, data.role);
    formData.append(`jobs[0]`, `1`);

    if (
      imageFile &&
      Object.keys(imageFile).length === 0 &&
      imageFile.constructor === Object
    ) {
      try {
        const defaultImageFile = await getDefaultImageFile();
        formData.append(`image`, defaultImageFile);
      } catch (error) {
        console.error("Error fetching default image:", error);
      }
    } else {
      formData.append(`image`, imageFile);
    }

    try {
      setSubmitinLoading(true);
      await adminsService.create<any>(formData);
      setSubmitinLoading(false);
      onModalOpen(false);
      notify();
      reset();
      setImageFile({} as File);
      if (onRefresh) onRefresh();
      setPhotoPreview("");
      setCreatingAdminError("");
    } catch (error: any) {
      setCreatingAdminError(error.response.data.data.error);
      setSubmitinLoading(false);
    }
  };

  return (
    <div className="modal modal-open tracking-wide">
      <div className="modal-box max-w-3xl px-10">
        <h3 className="font-bold text-lg text-left">Add Regular Admin</h3>
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
        {creatingAdminError && (
          <p className="text-lg text-red-500 p-2 my-2">{creatingAdminError}</p>
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
                <span className="label-text">Address</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="address"
                  className={`input input-bordered grow ${
                    errors.address && "border-[red]"
                  }`}
                  {...register("address")}
                />
                {errors.address && (
                  <RiErrorWarningLine color="red" className="w-6 h-6 ml-1" />
                )}
              </div>
              {errors.address && (
                <p className="text-[red] text-xs mt-3 ">
                  {errors.address.message}
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
          <div className="form-control">
            <label className="label">
              <span className="label-text">Roles</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                id="role"
                className="select select-bordered grow"
                {...register("role")}
              >
                <option
                  className="bg-gray-400 text-white"
                  value=""
                  disabled
                  selected
                >
                  Select Admin Role
                </option>
                {roles.map((role) => (
                  <option value={`${role.name}`}>{role.name}</option>
                ))}
              </select>
              {errors.role && (
                <RiErrorWarningLine color="red" className="w-6 h-6 ml-1" />
              )}
            </div>
            {errors.role && (
              <p className="text-[red] text-xs mt-3 ">{errors.role.message}</p>
            )}
          </div>
          <div className="modal-action flex justify-around items-center right-80 mt-20 mb-10 ">
            <button
              type="submit"
              className={`btn px-10 lg:px-20 bg-[#577656] text-[white]`}
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

export default AdminForm;
