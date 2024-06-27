import React, { useState, useEffect, useRef } from "react";
import { BiExport, BiPlusCircle, BiTrash } from "react-icons/bi";
import avatar from "../../../public/assets/admin/avatar.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningLine } from "react-icons/ri";
// import { CgClose } from "react-icons/cg";
import { FaEdit } from "react-icons/fa";
import apiClient from "../../services/api-client";
import vendorsService from "../../services/vendors-service";
import * as XLSX from "xlsx";
import useCategories from "../../hooks/useCategories";
import { saveAs } from "file-saver";
import Pagination from "../Pagination";
import VendorDataGrid from "./VendorDataGrid";
import useVendors from "../../hooks/useVendors";
import useAllVendors from "../../hooks/useAllVendors";
import DropZone from "./DropZone";
import DynamicForm from "./DynamicForm";
import { useAuth } from "../../contexts/AuthProvider";

// ZOD SCHEMA
const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces",
    }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(8, { message: "Phone number must be at least 8 digits long" })
    .max(20, { message: "Phone number must be at most 20 digits long" })
    .regex(/^\+?\d+$/, {
      message: "Phone number can only contain digits and an optional leading +",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" }),
  contactName: z
    .string()
    .min(3, { message: "Contact name must be at least 3 characters long" })
    .max(255, { message: "Contact name must be at most 255 characters long" }),
  hQAdress: z
    .string()
    .min(3, { message: "HQ address must be at least 3 characters long" })
    .max(255, { message: "HQ address must be at most 255 characters long" }),
  shippingAdress: z
    .string()
    .min(3, { message: "Shipping address must be at least 3 characters long" })
    .max(255, {
      message: "Shipping address must be at most 255 characters long",
    }),
  commission: z.number().min(0).max(100),
  ibanNumber: z
    .string()
    .min(15, { message: "IBAN number must be at least 15 characters long" })
    .max(34, { message: "IBAN number must be at most 34 characters long" })
    .regex(/^[A-Z0-9]+$/, {
      message: "IBAN number can only contain uppercase letters and digits",
    }),
  bankName: z
    .string()
    .min(3, { message: "Bank name must be at least 3 characters long" })
    .max(50, { message: "Bank name must be at most 50 characters long" }),
  bankAccountName: z
    .string()
    .min(3, { message: "Bank account name must be at least 3 characters long" })
    .max(50, {
      message: "Bank account name must be at most 50 characters long",
    }),
  accountNumber: z
    .string()
    .min(5, { message: "Account number must be at least 5 characters long" })
    .max(20, { message: "Account number must be at most 20 characters long" })
    .regex(/^\d+$/, { message: "Account number can only contain digits" }),
  swiftNumber: z
    .string()
    .min(8, { message: "SWIFT number must be at least 8 characters long" })
    .max(11, { message: "SWIFT number must be at most 11 characters long" })
    .regex(/^[A-Z0-9]+$/, {
      message: "SWIFT number can only contain uppercase letters and digits",
    }),
});

export type FormData = z.infer<typeof schema>;
export type OptionType = { label: string; value: string };
const Vendors = () => {
  // Handle Filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [selectedVendors, setSelectedVendors] = useState<Set<number>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);

  const [creatingVendorError, setCreatingVendorError] = useState<string>("");
  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);

  const [imageFile, setImageFile] = useState<File>({} as File);
  const [isCreatingVendorLoading, setCreatingVendorLoading] =
    useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationPage, setPaginationPage] = useState<string>("1");

  const [legalDocs, setLegalDocs] = useState<FileList>();

  const [commercialRegistration, setCommercialRegistration] =
    useState<FileList>();
  const [vatCertificate, setVATCertificate] = useState<FileList>();

  const [dynamicCategories, setDynamicCategories] = useState<
    { category: string; id: number }[]
  >([]);

  const { categories } = useCategories();

  // Fetch Admins ..

  const { vendors, meta, next, prev, isLoading } = useVendors({
    categories: selectedCategory,
    status: selectedStatus,
    search: searchValue,
    isFetching: trigerFetch,
    page: paginationPage,
  });

  const recordsPerPage = meta.per_page || 5;
  const nPages = Math.ceil(vendors.length / recordsPerPage);

  // Handle React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
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
      setImageFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    setIsDeleteEnabled(selectedVendors.size > 0);
  }, [selectedVendors]);

  const handleCheckAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allVendorsIds = vendors.map((admin) => admin.id);
      setSelectedVendors(new Set(allVendorsIds));
    } else {
      setSelectedVendors(new Set());
    }
  };

  const handleCheckboxChange = (id: number) => {
    const newSelectedVendors = new Set(selectedVendors);
    if (newSelectedVendors.has(id)) {
      newSelectedVendors.delete(id);
    } else {
      newSelectedVendors.add(id);
    }
    setSelectedVendors(newSelectedVendors);
  };

  const handleDelete = async () => {
    if (selectedVendors.size > 0) {
      const data = new FormData();
      Array.from(selectedVendors).forEach((id, index) => {
        data.append(`ids[${index}]`, id.toString());
      });
      try {
        await apiClient.post("/vendors/delete", data);
        toast.success("Vendors deleted successfully");
        setTrigerFetch(!trigerFetch);
        setSelectAll(false);
        // Optionally, refetch the data or update the state to remove the deleted admins
      } catch (error) {
        toast.error("Failed to delete Vendors");
      }
    }
  };

  // Handle inputs that unrelated with Hook Form.

  const [imageFileError, setImageFileError] = useState(false);
  const [legalDocsError, setLegalDocsError] = useState(false);
  const [commercialRegistrationError, setCommercialRegistrationError] =
    useState(false);
  const [vatCertificateError, setVatCertificateError] = useState(false);
  const [DynamicCategoriesError, setDynamicCategoriesError] = useState(false);

  useEffect(() => {
    if (!isEmptyObject(imageFile)) {
      setImageFileError(false);
    }
    if (legalDocs) {
      setLegalDocsError(false);
    }
    if (commercialRegistration) {
      setCommercialRegistrationError(false);
    }
    if (vatCertificate) {
      setVatCertificateError(false);
    }
    if (dynamicCategories) {
      setDynamicCategoriesError(false);
    }
  }, [
    imageFile,
    legalDocs,
    commercialRegistration,
    vatCertificate,
    dynamicCategories,
  ]);

  // Handle Submit
  const onSubmit = async (data: FormData) => {
    // Handle inputs that unrelated with Hook Form.

    if (isEmptyObject(imageFile)) {
      setImageFileError(true);
      return;
    }

    if (!legalDocs || legalDocs.length < 1) {
      setLegalDocsError(true);
      return;
    }

    if (!commercialRegistration || commercialRegistration.length < 1) {
      setCommercialRegistrationError(true);
      return;
    }
    if (!vatCertificate || vatCertificate?.length < 1) {
      setVatCertificateError(true);
      return;
    }
    if (!dynamicCategories || dynamicCategories?.length < 1) {
      setDynamicCategoriesError(true);
      return;
    }

    const formData = new FormData();

    formData.append(`name`, data.name);
    formData.append(`email`, data.email);
    formData.append(`password`, data.password);
    formData.append(`phone`, data.phone);
    formData.append(`contact_name`, data.contactName);
    formData.append(`hq_address`, data.hQAdress);
    formData.append(`shipping_address`, data.shippingAdress);
    formData.append(`commission`, `${data.commission}`);
    formData.append(`iban_number`, data.ibanNumber);
    dynamicCategories.map((item, index) => {
      formData.append(`categories[${index}]`, `${item.id}`);
    });

    // Bank Details
    formData.append(`bank_name`, data.bankName);
    formData.append(`bank_account_name`, data.bankAccountName);
    formData.append(`account_number`, data.accountNumber);
    formData.append(`swift_number`, data.swiftNumber);

    // FILES
    formData.append(`image`, imageFile);
    if (legalDocs && legalDocs[0]) {
      formData.append(`legal_docs`, legalDocs[0]);
    }
    if (commercialRegistration) {
      formData.append(`commercial_registration`, commercialRegistration[0]);
    }
    if (vatCertificate) {
      formData.append(`vat_certificate`, vatCertificate[0]);
    }

    try {
      setCreatingVendorLoading(true);
      const res = await vendorsService.create<any>(formData);
      console.log(res);
      setCreatingVendorLoading(false);
      setIsModalOpen(false);
      toast.success("Create Vendor Account Successfully!");
      setTrigerFetch(!trigerFetch);
    } catch (error: any) {
      setCreatingVendorError(error.response.data.data.error);
      setCreatingVendorLoading(false);
    }
  };
  const { allVendors, isAllVendorsError } = useAllVendors();
  const exportToExcel = () => {
    // Create a new workbook and a sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(allVendors);

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
  const isEmptyObject = (obj: { [key: string]: any }) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };
  const { auth } = useAuth();

  return (
    <div className="overflow-x-scroll p-5">
      <ToastContainer />

      {/* ACTION BUTTONS */}
      <div className="flex justify-between items-center mb-5">
        {isAllVendorsError && (
          <p className="text-red-600 text-lg p-2">{isAllVendorsError}</p>
        )}
        <h1 className="font-medium text-4xl capitalize">Vendors Details</h1>
        <div className="flex items-center gap-2">
          {auth?.permissions.find((per) => per === "vendor-create") && (
            <button
              className="btn bg-[#577656] text-[white]"
              onClick={openModal}
            >
              <BiPlusCircle className="text-xl" /> Add Vendor Account
            </button>
          )}
          <button
            onClick={handleDelete}
            className={`btn btn-outline text-[#E20000B2] ${
              !isDeleteEnabled && "cursor-not-allowed"
            }`}
            disabled={!isDeleteEnabled}
          >
            <BiTrash className="text-lg text-[#E20000B2]" /> Delete
          </button>
          {auth?.permissions.find((per) => per === "vendor-export") && (
            <button onClick={exportToExcel} className="btn btn-outline">
              <BiExport /> Export
            </button>
          )}
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
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
      ) : (
        <>
          <VendorDataGrid
            tableData={vendors}
            handleCheckAll={handleCheckAll}
            selectAll={selectAll}
            handleCheckboxChange={handleCheckboxChange}
            selectedAdmins={selectedVendors}
            metaObject={meta}
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
        <div className="modal modal-open tracking-wide ">
          <div className="modal-box max-w-4xl px-10 ">
            <h3 className="font-bold text-2xl text-left my-10">
              Add New Vendor
            </h3>
            <div className="flex flex-col justify-center items-center my-8 shadow-md p-6">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-36 h-36 object-cover rounded-full"
                />
              ) : (
                <img src={avatar} alt="avatar" />
              )}
              <p className="mt-3">
                {" "}
                {imageFileError && (
                  <p className="text-red-600 text-lg tracking-wider">
                    Image File iS Required!
                  </p>
                )}
              </p>
            </div>
            {creatingVendorError && (
              <p className="text-lg text-red-500 p-2 my-2">
                {creatingVendorError}
              </p>
            )}
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="shadow-xl p-8">
              <div className="py-4 grid grid-cols-2 gap-8 ">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Vendor Name</span>
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
                    <span className="label-text">Email</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      id="email"
                      className={`input input-bordered grow ${
                        errors.email && "border-[red]"
                      }`}
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
                    <span className="label-text">Contact Person Name</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="contactPersonName"
                      className={`input input-bordered grow ${
                        errors.phone && "border-[red]"
                      } `}
                      {...register("contactName")}
                    />
                    {errors.contactName && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
                    )}
                  </div>
                  {errors.contactName && (
                    <p className="text-[red] text-xs mt-3 ">
                      {errors.contactName.message}
                    </p>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      id="phone"
                      className={`input input-bordered ${
                        errors.email && "border-[red]"
                      }  grow`}
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
                    <span className="label-text">HQ Adress</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="hQAdress"
                      className={`input input-bordered grow ${
                        errors.hQAdress && "border-[red]"
                      }`}
                      {...register("hQAdress")}
                    />
                    {errors.hQAdress && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
                    )}
                  </div>
                  {errors.hQAdress && (
                    <p className="text-[red] text-xs mt-3 ">
                      {errors.hQAdress.message}
                    </p>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Shipping Adress</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="shippingAdress"
                      className={`input input-bordered grow ${
                        errors.email && "border-[red]"
                      }`}
                      {...register("shippingAdress")}
                    />
                    {errors.shippingAdress && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
                    )}
                  </div>
                  {errors.shippingAdress && (
                    <p className="text-[red] text-xs mt-3 ">
                      {errors.shippingAdress.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col  w-[100%]">
                  <DynamicForm
                    onSelectedCategories={(
                      selectedCate: { category: string; id: number }[]
                    ) => setDynamicCategories(selectedCate)}
                  />
                  {DynamicCategoriesError && (
                    <p className="text-red-600 text-lg tracking-wider mt-2">
                      Category Filed iS Required!
                    </p>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Commission</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="commission"
                      className={`input input-bordered grow ${
                        errors.commission && "border-[red]"
                      }`}
                      {...register("commission", { valueAsNumber: true })}
                    />
                    {errors.commission && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
                    )}
                  </div>
                  {errors.commission && (
                    <p className="text-[red] text-xs mt-3 ">
                      {errors.commission.message}
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
                    {errors.password && (
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
                  className={`absolute top-[230px] z-100 right-[390px] flex items-center   gap-3 rounded-md   bg-gray-50 cursor-pointer`}
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
              {/*  Attach legal Docs */}
              <div>
                <div className="my-10 border-b pb-12">
                  <label className="block text-xl font-medium text-gray-700 mb-5">
                    Attach legal Docs
                  </label>
                  <DropZone
                    onSubmit={(files: FileList) => setLegalDocs(files)}
                    className="p-2 my-2 border border-neutral-200"
                  />
                  {legalDocsError && (
                    <p className="text-red-600 text-lg tracking-wider">
                      Legal Documents is Required!
                    </p>
                  )}
                </div>
                <div className="my-10 border-b pb-12">
                  <label className="block text-xl font-medium text-gray-700 mb-5">
                    Commercial Registration
                  </label>
                  <DropZone
                    onSubmit={(files: FileList) =>
                      setCommercialRegistration(files)
                    }
                    className="p-2 my-2 border border-neutral-200"
                  />
                  {commercialRegistrationError && (
                    <p className="text-red-600 text-lg tracking-wider">
                      Commercial Registration is Required!
                    </p>
                  )}
                </div>
                <div className="my-10 border-b pb-12">
                  <label
                    htmlFor="legalDocs"
                    className="block text-xl font-medium text-gray-700 mb-5"
                  >
                    VAT Certificate
                  </label>
                  <DropZone
                    onSubmit={(files: FileList) => setVATCertificate(files)}
                    className="p-2 my-2 border border-neutral-200"
                  />
                  {vatCertificateError && (
                    <p className="text-red-600 text-lg tracking-wider">
                      Vat Certificate is Required!
                    </p>
                  )}
                </div>
              </div>

              <div className="my-4 shadow-md p-6">
                <h1 className="text-xl p-2">Bank Details</h1>
                <div className="form-control max-w-sm mb-10">
                  <label className="label">
                    <span className="label-text">Bank name</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="bankName"
                      className={`input input-bordered grow ${
                        errors.bankName && "border-[red]"
                      }`}
                      {...register("bankName")}
                    />
                    {errors.bankName && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
                    )}
                  </div>
                  {errors.bankName && (
                    <p className="text-[red] text-xs mt-3 ">
                      {errors.bankName.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Bank account name</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        id="BankAccountName"
                        className={`input input-bordered grow ${
                          errors.email && "border-[red]"
                        }`}
                        {...register("bankAccountName")}
                      />
                      {errors.bankAccountName && (
                        <RiErrorWarningLine
                          color="red"
                          className="w-6 h-6 ml-1"
                        />
                      )}
                    </div>
                    {errors.bankAccountName && (
                      <p className="text-[red] text-xs mt-3 ">
                        {errors.bankAccountName.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Account Number</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        id="accountNumber"
                        className={`input input-bordered grow ${
                          errors.accountNumber && "border-[red]"
                        }`}
                        {...register("accountNumber")}
                      />
                      {errors.accountNumber && (
                        <RiErrorWarningLine
                          color="red"
                          className="w-6 h-6 ml-1"
                        />
                      )}
                    </div>
                    {errors.accountNumber && (
                      <p className="text-[red] text-xs mt-3 ">
                        {errors.accountNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">IBAN Number</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        id="ibanNumber"
                        className={`input input-bordered grow ${
                          errors.ibanNumber && "border-[red]"
                        }`}
                        {...register("ibanNumber")}
                      />
                      {errors.ibanNumber && (
                        <RiErrorWarningLine
                          color="red"
                          className="w-6 h-6 ml-1"
                        />
                      )}
                    </div>
                    {errors.ibanNumber && (
                      <p className="text-[red] text-xs mt-3 ">
                        {errors.ibanNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">SWIFT Number</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        id="swiftNumber"
                        className={`input input-bordered grow ${
                          errors.email && "border-[red]"
                        }`}
                        {...register("swiftNumber")}
                      />
                      {errors.swiftNumber && (
                        <RiErrorWarningLine
                          color="red"
                          className="w-6 h-6 ml-1"
                        />
                      )}
                    </div>
                    {errors.swiftNumber && (
                      <p className="text-[red] text-xs mt-3 ">
                        {errors.swiftNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-action flex justify-around items-center right-80 ">
                <button
                  type="submit"
                  className={`btn px-20 bg-[#577656] text-[white]`}
                >
                  {isCreatingVendorLoading ? (
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

export default Vendors;
