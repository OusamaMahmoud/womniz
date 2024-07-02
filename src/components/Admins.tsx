import React, { useState, useEffect } from "react";
import { BiExport, BiPlusCircle, BiTrash } from "react-icons/bi";
import avatar from "/assets/admin/avatar.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningLine } from "react-icons/ri";
// import { CgClose } from "react-icons/cg";
import { FaEdit } from "react-icons/fa";
import useAdmins from "../hooks/useAdmins";
import apiClient from "../services/api-client";
import adminService from "../services/admins-service";
import useCategories from "../hooks/useCategories";
import Select from "react-select";
import { customStyles } from "../components/CustomSelect";
import Pagination from "./Pagination";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useAllAdmins from "../hooks/useAllAdmins";
import useRoles from "../hooks/useRoles";
import { useAuth } from "../contexts/AuthProvider";
import AdminsResponsiveTable from "./AdminsResponsiveTable";
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
  jobs: z.array(z.string()).min(1),
  status: z.enum(["0", "1"]).default("0"),
  country_id: z.enum(["2", "1"]).default("2"),
  role: z.string().min(3, { message: "Role Must Be Selected!" }),
});

export type FormData = z.infer<typeof schema>;
export type OptionType = { label: string; value: string };
const Admins: React.FC = () => {
  const { auth } = useAuth();
  const { roles } = useRoles();
  // Handle Filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [selectedAdmins, setSelectedAdmins] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);

  const [creatingAdminError, setCreatingAdminError] = useState<string>("");
  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);

  const [imageFile, setImageFile] = useState<File>({} as File);
  const [isSubmittinLoading, setSubmitinLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationPage, setPaginationPage] = useState<string>("1");
  // const [recordsPerPage] = useState(10);
  const { categories } = useCategories();
  const options: OptionType[] = categories.map((item) => ({
    label: item.title,
    value: item.title,
  }));

  const {
    admins,
    meta,
    next,
    prev,
    isLoading,
    error: fetchAdminsError,
  } = useAdmins({
    categories: selectedCategory,
    status: selectedStatus,
    search: searchValue,
    isFetching: trigerFetch,
    page: paginationPage,
  });

  const recordsPerPage = meta.per_page || 5;
  const nPages = Math.ceil(admins.length / recordsPerPage);

  // Handle React Hook Form

  const {
    register,
    handleSubmit,
    control,
    reset,
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // If a file is uploaded
      const file = e.target.files[0];
      setImageFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const getDefaultImageFile = async () => {
    // Create a default image file (you can use any default image file)
    // For example, create a new File object with a default image URL
    const defaultImageUrl = "https://placehold.co/100x100";
    const defaultImageFileName = "default-image.png";
    try {
      const response = await fetch(defaultImageUrl);
      console.log(response);
      const blob = await response.blob();
      return new File([blob], defaultImageFileName, { type: "image/png" });
    } catch (error: any) {
      throw new Error("Failed to fetch default image: " + error.message);
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
        await apiClient.post("/admins/delete", data);
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

  // Handle Submit
  const onSubmit = async (data: FormData) => {
    console.log(data);
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
      console.log(imageFile);
      console.log(photoPreview);
    }

    try {
      setSubmitinLoading(true);
      await adminService.create<any>(formData);
      setSubmitinLoading(false);
      setIsModalOpen(false);
      notify();
      reset();
      setImageFile({} as File);
      setPhotoPreview("");
      setTrigerFetch(!trigerFetch);
      setCreatingAdminError("");
    } catch (error: any) {
      setCreatingAdminError(error.response.data.data.error);
      setSubmitinLoading(false);
    }
  };

  const { alladmins, isAllAdminsError } = useAllAdmins();

  const exportToExcel = () => {
    // Create a new workbook and a sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(alladmins);

    // Append the sheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Admins");

    // Generate a binary string representation of the workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert the binary string to an array buffer
    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < wbout.length; i++) {
      view[i] = wbout.charCodeAt(i) & 0xff;
    }

    // Create a Blob from the array buffer and trigger the download
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      "admins.xlsx"
    );
  };
  return (
    <div className="overflow-x-scroll p-5">
      <ToastContainer />
      {fetchAdminsError && <p>{fetchAdminsError}</p>}
      {/* ACTION BUTTONS */}
      <div className=" justify-between items-center lg:flex mb-5">
        {isAllAdminsError && (
          <p className="text-red-600 text-lg p-2">{isAllAdminsError}</p>
        )}
        <h1 className="font-medium xl:text-4xl text-xl capitalize mb-3 lg:mb-0">Admins Details</h1>
        <div className="flex items-center flex-wrap gap-2">
          {auth?.permissions.find((per) => per === "admin-create") && (
            <button
              className="btn bg-[#577656] text-[white] text-[10px] lg:text-lg"
              onClick={openModal}
            >
              <BiPlusCircle className="xl:text-xl" /> Add Admin Account
            </button>
          )}
          {auth?.permissions.find((per) => per === "admin-delete") && (
            <button
              onClick={handleDelete}
              className={`btn btn-outline text-[#E20000B2] text-[10px] lg:text-lg ${
                !isDeleteEnabled && "cursor-not-allowed"
              }`}
              disabled={!isDeleteEnabled}
            >
              <BiTrash className="xl:text-lg text-[#E20000B2]" /> Delete
            </button>
          )}
          {auth?.permissions.find((per) => per === "admin-export") && (
            <button onClick={exportToExcel} className="btn text-[10px] lg:text-lg btn-outline">
              <BiExport /> Export
            </button>
          )}
        </div>
      </div>
      {/* Handle Filters */}
      <div className="my-6 flex items-center flex-wrap gap-3">
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
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            <option value="">ALL</option>
            {categories.map((cate) => (
              <option key={cate.id} value={cate.title}>
                {cate.title}
              </option>
            ))}
          </select>
        </div>
        {/* Status Bar */}
        <div className="form-control">
          <select
            className="select select-bordered"
            onChange={(e) => setSelectedStatus(e.target.value)}
            value={selectedStatus}
          >
            <option value="">ALL</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col gap-10">
          <div className="skeleton xl:h-10 w-full"></div>
          <div className="skeleton xl:h-10 w-full"></div>
          <div className="skeleton xl:h-10 w-full"></div>
          <div className="skeleton xl:h-10 w-full"></div>
          <div className="skeleton xl:h-10 w-full"></div>
          <div className="skeleton xl:h-10 w-full"></div>
        </div>
      ) : (
        <>
          <AdminsResponsiveTable
            tableData={admins}
            handleCheckAll={handleCheckAll}
            selectAll={selectAll}
            handleCheckboxChange={handleCheckboxChange}
            selectedObjects={selectedAdmins}
          />
          <Pagination
            onPage={(pg: string) => setPaginationPage(pg)}
            itemsPerPage={recordsPerPage}
            nPages={nPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            next={next}
            prev={prev}
          />
        </>
      )}

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
                  {/* {errors.image && (
                    <p className="absolute text-red-700 text-lg top-20 -left-40 w-96">
                      {errors.image?.message}
                    </p>
                  )} */}
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
                  <p className="text-[red] text-xs mt-3 ">
                    {errors.role.message}
                  </p>
                )}
              </div>
              {/* Category Multi-Selector */}
              <div className="form-control ">
                <label className="mb-3 mt-5">Select Category</label>
                <Controller
                  control={control}
                  defaultValue={options.map((c) => c.value)}
                  name="jobs"
                  render={({ field: { onChange, ref } }) => (
                    <Select
                      isMulti
                      ref={ref}
                      // value={options.filter((c) => value.includes(c.value))}
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
              <div className="modal-action flex justify-around items-center right-80 mt-20 mb-10 ">
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`btn px-20 bg-[#577656] text-[white]`}
                >
                  {isSubmittinLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    `Save`
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
    </div>
  );
};

export default Admins;
