import { useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../services/api-client";
import { Admin } from "../services/admins-service";
import { toast } from "react-toastify";
import avatar from "../assets/admin/avatar.svg";
import { Controller, set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OptionType } from "./Admins";
import { z } from "zod";
import { RiErrorWarningLine } from "react-icons/ri";
import useCategories from "../hooks/useCategories";
import Select from "react-select";
import { customStyles } from "./CustomSelect";
import { FaEdit } from "react-icons/fa";

//FORM SCHEMA
const schema = z.object({
  name: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z\s]*$/),
  email: z.string().email(),
  // password: z.string().min(8).max(50),
  password: z.union([z.string().length(0), z.string().min(8).max(50)]),
  birthdate: z
    .string()
    .refine((value) => {
      // Validate date format (YYYY-MM-DD)
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(value);
    }, "Invalid date format (YYYY-MM-DD)")
    .refine((value) => {
      // Validate age (must be 18 years or older)
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1;
      }
      return age;
    }, "Must be 18 years or older"),

  address: z.string().min(3).max(255),
  phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?\d+$/),
  jobs: z.array(z.string()).min(1),
  status: z.enum(["0", "1"]).default("0"),
  country_id: z.enum(["2", "1"]).default("2"),
});

type FormData = z.infer<typeof schema>;

const AdminProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null | undefined>(
    null
  );
  const [creatingAdminError, setCreatingAdminError] = useState<string>("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [isSubmittinLoading, setSubmitinLoading] = useState<boolean>(false);
  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);

  const params = useParams();
  const navigate = useNavigate();
  const [targetAdmin, setTargetAdmin] = useState<Admin>({} as Admin);
  const [targetAdminError, setTaretAdminError] = useState<string>("");

  // ADMINS CATEGORIES
  const { categories } = useCategories();

  const options: OptionType[] = categories.map((item) => ({
    label: item.title,
    value: item.title,
  }));

  // Handle PHOTO IN EDIT FORM
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPhotoPreview(null);
  };

  
  // FETCH THE TARGET ADMIN.
  useEffect(() => {
    apiClient
      .get<{ data: Admin }>(`/admins/${params.id}`)
      .then((res) => {
        setTargetAdmin(res.data.data);
        setPhotoPreview(res.data.data.image)
      })
      .catch((err) => setTaretAdminError(err.message));
  }, []);



  // HANDLE STATUS CHANGE
  const [status, setStatus] = useState<string>("0");

  useEffect(() => {
    setStatus(targetAdmin?.status);
  }, [targetAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    const newStatus = parseInt(e.target.value);
    try {
      const res = apiClient.post(`/admins/${targetAdmin.id}/switchstatus`, {
        status: newStatus,
      });
      console.log(res);
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleEditButton = () => {
    openModal();
  };

  // DELETE ADMIN.
  const handleConfirmationDelete = () => {
    (
      document.getElementById("deletion-modal") as HTMLDialogElement
    ).showModal();
  };
  const handleDeleteButton = () => {
    const data = new FormData();
    if (params && params.id) {
      data.append(`ids[1]`, params.id.toString());
    }
    apiClient
      .post("/admins/delete", data)
      .then((res) => {
        toast.success("Admins deleted successfully");
        navigate("/accounts/Admins");
        (
          document.getElementById("deletion-modal") as HTMLDialogElement
        ).close();
      })
      .catch((err) => {
        toast.error("Failed to delete admin");
        toast.error(err.message);
        (
          document.getElementById("deletion-modal") as HTMLDialogElement
        ).close();
      });
  };

  // UPDATE ADMIN FORM.
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
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
    formData.append(`jobs[0]`, `1`);
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
        toast.success("Update Admin Successfully!");
      }
      setSubmitinLoading(false);
      setIsModalOpen(false);
    } catch (error: any) {
      if (!error?.response) {
        setCreatingAdminError("No Server Response!!");
        setSubmitinLoading(false);
      } else {
        setCreatingAdminError(error.response.data.data.error);
        setSubmitinLoading(false);
        setIsModalOpen(false);
      }
    }
  };
  useEffect(()=>{
console.log(targetAdmin.image)
  },[targetAdmin])

  return (
    <>
      {/* MODAL OF UPDATE ADMIN. */}
      {isModalOpen && (
        <div className="modal modal-open tracking-wide">
          <div className="modal-box max-w-3xl px-10">
            <h3 className="font-bold text-lg text-left">Add Regular Admin</h3>
            <div className="flex justify-center items-center my-8">
              {targetAdmin && targetAdmin.image && (
                <img
                  src={targetAdmin.image}
                  alt="Preview"
                  className="w-36 h-36 object-cover rounded-full"
                />
              )}
            </div>
            {creatingAdminError && (
              <p className="text-lg text-red-500 p-2 my-2">
                {creatingAdminError}
              </p>
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
                      defaultValue={targetAdmin.name}
                      {...register("name")}
                      className={`input input-bordered  grow ${
                        errors.name && "border-[red]"
                      }`}
                    />
                    {errors.name && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
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
                      defaultValue={targetAdmin.birthdate}
                      id="birthdate"
                      className={`input input-bordered grow ${
                        errors.birthdate && "border-[red]"
                      }`}
                      {...register("birthdate")}
                    />

                    {errors.birthdate && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
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
                      defaultValue={targetAdmin.phone}
                      id="phone"
                      className={`input input-bordered grow ${
                        errors.phone && "border-[red]"
                      } `}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
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
                      defaultValue={targetAdmin.email}
                      id="email"
                      className={`input input-bordered ${
                        errors.email && "border-[red]"
                      }  grow`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
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
                      defaultValue={targetAdmin.address}
                      id="address"
                      className={`input input-bordered grow ${
                        errors.address && "border-[red]"
                      }`}
                      {...register("address")}
                    />
                    {errors.address && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
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
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
                    )}
                  </div>
                  {errors.password && (
                    <p className="text-[red] text-xs mt-3 ">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                {/* Category Multi-Selector */}
                <div className="form-control ">
                  <Controller
                    control={control}
                    defaultValue={options.map((c) => c.value)}
                    name="jobs"
                    render={({ field: { onChange, value, ref } }) => (
                      <Select
                        isMulti
                        ref={ref}
                        // value={options?.filter((c) => value?.includes(c.value))}
                        onChange={(val) => onChange(val.map((c) => c.value))}
                        options={options}
                        styles={customStyles}
                      />
                    )}
                  />
                  {errors.jobs && (
                    <p className="text-red-500 ">{errors.jobs.message}</p>
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
              <div className="modal-action flex justify-around items-center right-80 ">
                <button
                  type="submit"
                  className={`btn px-20 bg-[#577656] text-[white] ${
                    !isValid && "opacity-50 cursor-not-allowed"
                  }}`}
                >
                  {isSubmittinLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    `Updata`
                  )}
                </button>
                <button
                  className={`btn bg-transparent px-20`}
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ADMIN.  */}
      <dialog
        id="deletion-modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">Do you really want to delete this Account?</p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() =>
                (
                  document.getElementById("deletion-modal") as HTMLDialogElement
                ).close()
              }
            >
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDeleteButton}>
              Confirm
            </button>
          </div>
        </div>
      </dialog>
      {targetAdminError && (
        <p className="text-lg p-2 text-red-600">{targetAdminError}</p>
      )}

      {/* NAVBAR */}
      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center shadow-xl p-8">
          <div className="flex gap-3 items-start">
            <div className="w-20 h-20">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="hi"
                  className="object-cover w-full h-full rounded-full"
                />
              )}
            </div>
            <div className="ml-2">
              <p className="text-xl font-bold capitalize ">
                {targetAdmin.name}
              </p>
              <p className="capitalize">{targetAdmin.category}</p>
              <p className="capitalize">{targetAdmin.country}</p>
            </div>
            <select
              className={`select select-bordered ml-4 ${
                status == "1" ? "bg-[#ECFDF3]" : "bg-[#FDECEC]"
              }`}
              value={status}
              onChange={handleChange}
            >
              <option value={"1"}>Active</option>
              <option value={"0"}>Inactive</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleConfirmationDelete}
              className="flex items-center gap-2 text-[red] border border-[#d6cccc] rounded-md p-2"
            >
              <BiTrash className="text-xl" />
              Delete
            </button>
            <button
              onClick={handleEditButton}
              className="flex items-center gap-2  border border-[#d6cccc] rounded-md py-2 px-[18px]"
            >
              <BiEdit className="text-xl" /> Edit
            </button>
          </div>
        </div>
        {/* PUT ADMIN INFORMATION */}

        <div className="mt-20 p-10  rounded-lg shadow-xl">
          <h1 className="font-bold text-xl">Personal Information</h1>
          <div className="flex justify-between max-w-xs mt-5">
            <div className="flex flex-col gap-1">
              <span className="font-bold">Name</span>
              <span>{targetAdmin.name}</span>
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <span className="font-bold">Date of Birth</span>
              <span className="text-[gray]">{targetAdmin.birthdate}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <span className="font-bold">Email</span>
            <span className="text-[gray]">{targetAdmin.email}</span>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <span className="font-bold">Phone Number</span>
            <span className="text-[gray]">{targetAdmin.phone}</span>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <span className="font-bold">Bio</span>
            <span className="text-[gray]">{targetAdmin.category}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
