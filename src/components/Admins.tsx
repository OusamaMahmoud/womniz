import React, { useState, useEffect } from "react";
import { BiExport, BiPlusCircle, BiTrash } from "react-icons/bi";
import avatar from "../assets/admin/avatar.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningLine } from "react-icons/ri";
// import { CgClose } from "react-icons/cg";
import { FaEdit } from "react-icons/fa";
import DataGrid from "./DataGrid";
import useAdmins from "../hooks/useAdmins";
import apiClient from "../services/api-client";
import adminService from "../services/admins-service";
import useCategories from "../hooks/useCategories";
import Select from "react-select";
import { customStyles } from "../components/CustomSelect";
// ZOD SCHEMA
const schema = z.object({
  name: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z\s]*$/),
  email: z.string().email(),
  password: z.string().min(8).max(50),
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
  image: z
    .any()
    .refine((file) => file && file.length > 0, "Profile picture is required"),
  jobs: z.array(z.string()).min(1),
  status: z.enum(["0", "1"]).default("0"),
  country_id: z.enum(["2", "1"]).default("2"),
});

type FormData = z.infer<typeof schema>;
type OptionType = { label: string; value: string };
const Admins: React.FC = () => {
  // Handle Filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [selectedAdmins, setSelectedAdmins] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);

  const [creatingAdminError, setCreatingAdminError] = useState<string>("");
  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);

  // const [selectedCategories, setSelectedCategories] = useState<
  //   OnChangeValue<OptionType, boolean>
  // >([]);

  const { categories } = useCategories();

  const options: OptionType[] = categories.map((item) => ({
    label: item.title,
    value: item.title,
  }));

  // Fetch Admins ..

  const { admins } = useAdmins({
    categories: selectedCategory,
    status: selectedStatus,
    search: searchValue,
    isFetching: trigerFetch,
  });
  // const {categories ,setCategories}=useCategories()

  // Handle React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPhotoPreview(null);
  };

  // Handle Photo Create
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // setNewAdmin((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    setIsDeleteEnabled(selectedAdmins.size > 0);
  }, [selectedAdmins]);

  const handleCheckAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allAdminIds = admins.map((admin) => admin.id);
      setSelectedAdmins(new Set(allAdminIds));
    } else {
      setSelectedAdmins(new Set());
    }
  };

  const handleCheckboxChange = (id: number) => {
    const newSelectedAdmins = new Set(selectedAdmins);
    if (newSelectedAdmins.has(id)) {
      newSelectedAdmins.delete(id);
    } else {
      newSelectedAdmins.add(id);
    }
    setSelectedAdmins(newSelectedAdmins);
  };

  const handleDelete = async () => {
    if (selectedAdmins.size > 0) {
      const data = new FormData();
      Array.from(selectedAdmins).forEach((id, index) => {
        data.append(`ids[${index}]`, id.toString());
      });
      try {
        const response = await apiClient.post("/admins/delete", data);
        console.log(response)
        toast.success("Admins deleted successfully");
        setTrigerFetch(!trigerFetch);
        setSelectAll(false);
        // Optionally, refetch the data or update the state to remove the deleted admins
      } catch (error) {
        toast.error("Failed to delete admins");
      }
    }
  };
  // Toastify
  const notify = () => toast.success("Create Admin Successfully!");

  // const handleCategoryChange = (selectedOptions) => {
  //   setSelectedCategories(selectedOptions);
  // };
  console.log(selectedStatus);
  // Handle Submit
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
    formData.append(`image`, data.image[0]);
    formData.append("jobs[0]", "1");

    try {
      const res = await adminService.create<any>(formData);
      console.log(res)
      setIsModalOpen(false);
      notify();
      setTrigerFetch(!trigerFetch);
    } catch (error: any) {
      setCreatingAdminError(error.response.data.data.error);
    }
  };

  return (
    <div className="overflow-x-scroll p-5">
      <ToastContainer />

      {/* ACTION BUTTONS */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-medium text-4xl capitalize">Admins Details</h1>
        <div className="flex items-center gap-2">
          <button className="btn bg-[#577656] text-[white]" onClick={openModal}>
            <BiPlusCircle className="text-xl" /> Add Admin Account
          </button>
          <button
            onClick={handleDelete}
            className={`btn btn-outline text-[#E20000B2] ${
              !isDeleteEnabled && "cursor-not-allowed"
            }`}
            disabled={!isDeleteEnabled}
          >
            <BiTrash className="text-lg text-[#E20000B2]" /> Delete
          </button>
          <button className="btn btn-outline">
            <BiExport /> Export
          </button>
        </div>
      </div>
      {/* Handle Filters */}
      <div className="my-6 flex items-center gap-3">
        {/* Search Bar */}
        <div className="form-control">
          <label className="input input-bordered grow flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="grow"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </label>
        </div>
        {/* Category Bar */}
        <div className="form-control">
          <select
            className="select select-bordered"
            onChange={(e) => setSelectedCategory([e.target.value])}
            value={selectedCategory}
          >
            <option value="">ALL</option>
            <option value="Account Management">Account Management</option>
            <option value="Products Management">Products Management</option>
            <option value="Jewellery Management">Jewellery Management</option>
            <option value="Salons Management">Salons Management</option>
            <option value="Orders and Discount Management">
              Orders and Discount Management
            </option>
          </select>
        </div>
        {/* Status Bar */}
        <div className="form-control">
          <select
            className="select select-bordered"
            onChange={(e) =>setSelectedStatus(e.target.value)}
            value={selectedStatus}
          >
            <option value="">ALL</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      {/* Table */}
      <DataGrid
        tableData={admins}
        handleCheckAll={handleCheckAll}
        selectAll={selectAll}
        handleCheckboxChange={handleCheckboxChange}
        selectedAdmins={selectedAdmins}
      />

      {/* Modal */}
      {isModalOpen && (
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
                      id="name"
                      className={`input input-bordered  grow ${
                        errors.name && "border-[red]"
                      }`}
                      {...register("name")}
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
                      id="dateOfBirth"
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
                      id="location"
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
                        value={options.filter((c) => value.includes(c.value))}
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
                    {...register("image")}
                    className="file-input file-input-bordered"
                    multiple
                    onChange={handleFileChange}
                    hidden
                  />
                  {/* {errors.image && (
                    <p className="absolute text-red-700 text-lg top-20 -left-40 w-96">
                      {errors.image.message}
                    </p>
                  )} */}
                </label>
              </div>
              <div className="modal-action flex justify-around items-center right-80 ">
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`btn px-20 bg-[#577656] text-[white] ${
                    !isValid && "opacity-50 cursor-not-allowed"
                  }}`}
                >
                  Save
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
    </div>
  );
};

export default Admins;
