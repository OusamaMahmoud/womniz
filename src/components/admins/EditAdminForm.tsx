import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import { useParams } from "react-router-dom";

import { z } from "zod";
import { Admin } from "../../services/admins-service";
import apiClient from "../../services/api-client";
import useCategories from "../../hooks/useCategories";
import useRoles from "../../hooks/useRoles";

const schema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  // password: z.string().min(8).max(50),
  password: z.union([z.string().length(0), z.string().min(8).max(50)]),
  birthdate: z.string().date(),
  address: z.string().min(3).max(255),
  phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?\d+$/),
  status: z.enum(["0", "1"]).default("0"),
  country_id: z.enum(["2", "1"]).default("2"),
  role: z.string().min(1),
});

type FormData = z.infer<typeof schema>;
type OptionType = { label: string; value: number };

const EditAdminForm = ({
  onModalOpen,
  handleUpdatedAdmin,
}: {
  onModalOpen: (state: boolean) => void;
  handleUpdatedAdmin: () => void;
}) => {
  const [targetAdmin, setTargetAdmin] = useState<Admin>({} as Admin);
  const params = useParams();
  const [photoPreview, setPhotoPreview] = useState<string | null | undefined>(
    null
  );
  const [, setTaretAdminError] = useState<string>("");
  const [creatingAdminError, setCreatingAdminError] = useState<string>("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [isSubmittinLoading, setSubmitinLoading] = useState<boolean>(false);

  // FETCH THE TARGET ADMIN.
  useEffect(() => {
    apiClient
      .get<{ data: Admin }>(`/admins/${params.id}`)
      .then((res) => {
        setTargetAdmin(res.data.data);
        console.log(res.data.data);
        setPhotoPreview(res.data.data.image);
      })
      .catch((err) => setTaretAdminError(err.message));
  }, []);

  // Handle PHOTO IN EDIT FORM
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  const { categories } = useCategories();

  const options: OptionType[] = categories.map((item) => ({
    label: item.title,
    value: item.id,
  }));

  const closeModal = () => {
    onModalOpen(false);
    setPhotoPreview(null);
  };

  // UPDATE ADMIN FORM.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      name: targetAdmin.name,
      address: targetAdmin.address,
      birthdate: targetAdmin.birthdate,
      phone: targetAdmin.phone,
      email: targetAdmin.email,
      password: "",
      role: targetAdmin.role,
      country_id: "2",
      status: "0",
    },
  });

  const [adminSelectedCategories, setAdminSelectedCategories] = useState<
    OptionType[]
  >([]);

  useEffect(() => {
    setAdminSelectedCategories(
      options?.filter((c) => targetAdmin.category.includes(c.label))
    );
    if (targetAdmin && targetAdmin.image) {
      setPhotoPreview(targetAdmin.image);
    }
  }, [targetAdmin]);

  useEffect(() => {
    console.log(adminSelectedCategories);
  }, [adminSelectedCategories]);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append(`name`, data.name);
    formData.append(`address`, data.address);
    formData.append(`birthdate`, data.birthdate);
    formData.append(`country_id`, data.country_id);
    formData.append(`email`, data.email);
    formData.append(`password`, data.password);
    formData.append(`phone`, data.phone);
    formData.append(`status`, data.status);
    formData.append(`role`, data.role);
    formData.append(`jobs[0]`, `1`);

    // if (adminSelectedCategories && adminSelectedCategories.length > 1) {
    //   adminSelectedCategories.map((adminCategory, idx) => {
    //     formData.append(`jobs[${idx}]`, adminCategory?.value?.toString());
    //   });
    // }

    if (imageFile !== null) {
      formData.append(`image`, imageFile);
    }
    formData.append("_method", "PUT");

    try {
      setSubmitinLoading(true);
      const res = await apiClient.post(`/admins/${params.id}`, formData);
      if (res.status === 200) {
        setTargetAdmin((prev) => ({
          ...prev,
          ...data,
          image: imageFile ? URL.createObjectURL(imageFile) : prev.image,
        }));
        setPhotoPreview(imageFile && URL.createObjectURL(imageFile));
      }
      setSubmitinLoading(false);
      if (handleUpdatedAdmin) handleUpdatedAdmin();
      onModalOpen(false);
    } catch (error: any) {
      if (!error?.response) {
        setCreatingAdminError("No Server Response!!");
        setSubmitinLoading(false);
      } else {
        setCreatingAdminError(error.response.data.data.error);
        setSubmitinLoading(false);
        onModalOpen(false);
      }
    }
  };
  const { roles } = useRoles();
  return (
    <div className="modal modal-open tracking-wide">
      <div className="modal-box max-w-3xl px-10">
        <h3 className="font-bold text-lg text-left">Update Regular Admin</h3>
        <div className="flex justify-center items-center my-8">
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-36 h-36 object-cover rounded-full"
            />
          )}
        </div>
        {creatingAdminError && (
          <p className="text-lg text-red-500 p-2 my-2">{creatingAdminError}</p>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4 grid grid-cols-2 gap-8 ">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <div className="flex  items-center gap-2">
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`input input-bordered  grow ${
                    errors.name && "border-[red]"
                  }`}
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
              className={`absolute top-[160px] z-100 right-[325px] flex items-center   gap-3 rounded-md   bg-gray-50 cursor-pointer`}
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
          <div className="form-control mb-6">
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
          <div className="modal-action flex justify-around items-center right-80 ">
            <button
              type="submit"
              className={`btn px-20 bg-[#577656] text-white`}
            >
              {isSubmittinLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                `Updata`
              )}
            </button>
            <button className={`btn bg-transparent px-20`} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminForm;
