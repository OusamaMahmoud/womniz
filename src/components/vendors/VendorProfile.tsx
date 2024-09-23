import { useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../services/api-client";
import { Vendor } from "../../services/vendors-service";
import { toast } from "react-toastify";
import avatar from "/assets/admin/avatar.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import { useAuth } from "../../contexts/AuthProvider";
import DynamicForm from "./DynamicForm";
import Dropzone from "./DropZone";
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

type FormData = z.infer<typeof schema>;

const VendorProfile = () => {
  const handleDeleteDiscountButton = () => {
    (
      document.getElementById("deletion-discount-modal") as HTMLDialogElement
    ).close();
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null | undefined>(
    null
  );
  // const [creatingCustomerError, setCreatingCustomerError] =
  //   useState<string>("");

  const [imageFile, setImageFile] = useState<any>();
  const [isSubmittinLoading] = useState<boolean>(false);
  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);

  const params = useParams();
  const navigate = useNavigate();
  const [targetAdmin, setTargetAdmin] = useState<Vendor>({} as Vendor);
  const [targetAdminError, setTaretAdminError] = useState<string>("");
  const [commercialRegistration, setCommercialRegistration] =
    useState<FileList>();

  const [, setCreatingVendorError] = useState<string>("");
  const [, setFormSubmitionLoading] = useState(false);

  // Handle Photo Create
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
  };

  useEffect(() => {
    apiClient
      .get<{ data: Vendor }>(`/vendors/${params.id}`)
      .then((res) => {
        setTargetAdmin(res.data.data);
      })
      .catch((err) => setTaretAdminError(err.message));
  }, []);

  useEffect(() => {
    if (targetAdmin) setPhotoPreview(targetAdmin.image);
  }, [targetAdmin]);

  const handleEditButton = () => {
    openModal();
  };

  const handleCustomerConfirmationDelete = () => {
    (
      document.getElementById("deletion-modal") as HTMLDialogElement
    ).showModal();
  };
  const handleDeleteCustomerButton = () => {
    const data = new FormData();
    if (params && params.id) {
      data.append(`ids[1]`, params.id.toString());
    }

    apiClient
      .post("/users/delete", data)
      .then(() => {
        toast.success("Customer deleted successfully");
        navigate("/accounts/customers");
        (
          document.getElementById("deletion-modal") as HTMLDialogElement
        ).close();
      })
      .catch((err) => {
        toast.error("Failed to delete customer");
        toast.error(err.message);
        (
          document.getElementById("deletion-modal") as HTMLDialogElement
        ).close();
      });
  };

  // HANDLE STATUS CHANGE
  const [status, setStatus] = useState<string>("0");

  useEffect(() => {
    setStatus(targetAdmin?.status);
  }, [targetAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    const newStatus = parseInt(e.target.value);
    try {
      apiClient.get(`/vendors/${targetAdmin.id}/switchstatus`, {
        params: { status: newStatus },
      });
    } catch (err: any) {}
  };

  // const notify = () => toast.success("Create Admin Successfully!");

  const { auth } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [imageFileError] = useState(false);
  // const [dynamicCategoriesError, setDynamicCategoriesError] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<
    { category: string; id: number }[]
  >([]);

  const [legalDocs, setLegalDocs] = useState<FileList>();
  const [vatCertificate, setVATCertificate] = useState<FileList>();
  // const isEmptyObject = (obj: { [key: string]: any }) => {
  //   return Object.keys(obj).length === 0 && obj.constructor === Object;
  // };

  useEffect(() => {
    setDynamicCategories(
      targetAdmin?.categories?.map((c) => ({ category: c.name, id: c.id }))
    );
  }, [targetAdmin]);

  // Handle Submit
  const onSubmit = async (data: FormData) => {
    // Handle inputs that unrelated with Hook Form.

    const formData = new FormData();

    if (data) {
      formData.append(`name`, data.name);
      formData.append(`email`, data.email);
      formData.append(`phone`, data.phone);
      formData.append(`contact_name`, data.contactName);
      formData.append(`hq_address`, data.hQAdress);
      formData.append(`shipping_address`, data.shippingAdress);
      formData.append(`commission`, `${data.commission}`);
      formData.append(`iban_number`, data.ibanNumber);

      // Bank Details
      formData.append(`bank_name`, data.bankName);
      formData.append(`bank_account_name`, data.bankAccountName);
      formData.append(`account_number`, data.accountNumber);
      formData.append(`swift_number`, data.swiftNumber);
    }

    dynamicCategories.map((item, index) => {
      formData.append(`categories[${index}]`, `${item.id}`);
    });

    // FILES
    if (imageFile !== null && imageFile !== undefined) {
      formData.append(`image`, imageFile);
    }

    if (legalDocs && legalDocs[0]) {
      formData.append(`legal_docs`, legalDocs[0]);
    }
    if (commercialRegistration && commercialRegistration[0]) {
      formData.append(`commercial_registration`, commercialRegistration[0]);
    }
    if (vatCertificate && vatCertificate[0]) {
      formData.append(`vat_certificate`, vatCertificate[0]);
    }

    formData.append(`_method`, `PUT`);

    try {
      setFormSubmitionLoading(true);
      await apiClient.post(`/vendors/${params.id}`, formData);
      setFormSubmitionLoading(false);
      setIsModalOpen(false);
      toast.success("Create Vendor Account Successfully!");
      setTrigerFetch(!trigerFetch);
    } catch (error: any) {
      console.log("does it that => ", error.response.data.data.error);
      setCreatingVendorError(error.response.data.data.error);
      setFormSubmitionLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal modal-open tracking-wide ">
          <div className="modal-box max-w-4xl px-10 ">
            <h3 className="font-bold text-2xl text-left my-10">
              Edit Your Profile
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
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="shadow-xl p-8">
              <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-8 ">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Vendor Name</span>
                  </label>
                  <div className="flex  items-center gap-2">
                    <input
                      type="text"
                      id="name"
                      defaultValue={targetAdmin.name}
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
                      defaultValue={targetAdmin.email}
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
                      defaultValue={targetAdmin.contactName}
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
                      defaultValue={targetAdmin.phone}
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
                      defaultValue={targetAdmin.hqAddress}
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
                      defaultValue={targetAdmin.shippingAddress}
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
                    initailCategories={targetAdmin.categories}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Commission</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="commission"
                      defaultValue={targetAdmin.commission}
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
                  <Dropzone
                    onSubmit={(files: FileList) => setLegalDocs(files)}
                    payload={targetAdmin.legalDocs}
                    className="p-2 my-2 border border-neutral-200"
                  />
                </div>

                <div className="my-10 border-b pb-12">
                  <label className="block text-xl font-medium text-gray-700 mb-5">
                    Commercial Registration
                  </label>
                  <Dropzone
                    onSubmit={(files: FileList) =>
                      setCommercialRegistration(files)
                    }
                    payload={targetAdmin.commercialRegistration}
                    className="p-2 my-2 border border-neutral-200"
                  />
                </div>

                <div className="my-10 border-b pb-12">
                  <label
                    htmlFor="legalDocs"
                    className="block text-xl font-medium text-gray-700 mb-5"
                  >
                    VAT Certificate
                  </label>
                  <Dropzone
                    onSubmit={(files: FileList) => setVATCertificate(files)}
                    payload={targetAdmin.vatCertificate}
                    className="p-2 my-2 border border-neutral-200"
                  />
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
                      defaultValue={targetAdmin.bankName}
                      className={`input input-bordered max-sm:w-10  grow ${
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Bank account name</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        id="BankAccountName"
                        defaultValue={targetAdmin.bankAccountName}
                        className={`input input-bordered max-sm:w-10  grow ${
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
                        defaultValue={targetAdmin.accountNumber}
                        className={`input input-bordered max-sm:w-10  grow ${
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
                        defaultValue={targetAdmin.ibanNumber}
                        className={`input input-bordered max-sm:w-10  grow ${
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
                        defaultValue={targetAdmin.swiftNumber}
                        className={`input input-bordered max-sm:w-10  grow ${
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
                  className={`btn  px-10 lg:px-20 bg-[#577656] text-[white]`}
                >
                  {isSubmittinLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    `Save`
                  )}
                </button>
                <button
                  className={`btn bg-transparent  px-10 lg:px-20`}
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {targetAdminError && (
        <p className="text-lg p-2 text-red-600">{targetAdminError}</p>
      )}

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
            <button
              className="btn btn-error"
              onClick={handleDeleteCustomerButton}
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>

      <dialog
        id="deletion-discount-modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">Do you really want to delete this Voucher?</p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() =>
                (
                  document.getElementById(
                    "deletion-discount-modal"
                  ) as HTMLDialogElement
                ).close()
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleDeleteDiscountButton}
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>

      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center shadow-xl p-8">
          <div className="flex gap-3 items-start">
            <div className="w-20 h-20">
              <img
                src={targetAdmin.image}
                alt="avatar"
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            <div className="ml-2">
              <p className="text-xl font-bold capitalize ">
                {targetAdmin.name}
              </p>
              <p className="capitalize">Vendor</p>
              <p className="capitalize">{targetAdmin.shippingAddress}</p>
            </div>
            {auth?.permissions.find(
              (per) => per === "vendor-change-status"
            ) && (
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
            )}
          </div>
          <div className="flex gap-4">
            {auth?.permissions.find((per) => per === "vendor-delete") && (
              <button
                onClick={handleCustomerConfirmationDelete}
                className="flex items-center gap-2 text-[red] border border-[#d6cccc] rounded-md p-2"
              >
                <BiTrash className="text-xl" />
                Delete
              </button>
            )}
            {auth?.permissions.find((per) => per === "vendor-edit") && (
              <button
                onClick={handleEditButton}
                className="flex items-center gap-2  border border-[#d6cccc] rounded-md py-2 px-[18px]"
              >
                <BiEdit className="text-xl" /> Edit
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-start gap-10 mt-20">
          <div className="min-w-[800px]">
            <div className="mt-20 p-10  rounded-lg shadow-xl">
              <h1 className="font-bold text-2xl mt-2">Personal Information</h1>
              <div className="flex justify-between max-w-xs mt-5">
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Name</span>
                  <span>{targetAdmin.name}</span>
                </div>
                <div className="flex flex-col gap-1 mt-5">
                  <span className="font-bold">Contact Person Name</span>
                  <span className="text-[gray]">{targetAdmin.contactName}</span>
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
                <span className="font-bold">Category</span>
                <div className="flex gap-1">
                  {targetAdmin.categories &&
                    targetAdmin.categories.map((item) => (
                      <span key={item.id} className="text-[gray]">
                        {item.name},{" "}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div className="p-8 mt-8 rounded shadow-xl">
              <div className="mb-8 flex justify-between items-center">
                <h1 className="font-bold text-xl">Brands</h1>
                <Link
                  to={"/accounts/vendors/brands"}
                  className="text-green-300 flex gap-2 items-center"
                >
                  View Details <GoLink />
                </Link>
              </div>
              <div className="flex items-center gap-4 overflow-hidden max-w-2xl">
                {Array(20)
                  .fill(null)
                  .map((_) => (
                    <img
                      src="/assets/vendor/zara.svg"
                      className="object-cover"
                    />
                  ))}
              </div>
            </div>
            <div className="p-8 mt-8 rounded shadow-xl">
              <div className="mb-8 flex justify-between items-center">
                <h1 className="font-bold text-xl">Products</h1>
                <Link
                  to={"/brands"}
                  className="text-green-300 flex gap-2 items-center"
                >
                  View Details <GoLink />
                </Link>
              </div>
              <div className="flex items-center gap-8 overflow-hidden max-w-2xl">
                {Array(20)
                  .fill(null)
                  .map((_) => (
                    <img
                      src="/assets/vendor/hoodie.svg"
                      className="object-cover"
                    />
                  ))}
              </div>
            </div>
            <div className="mt-20 p-10  rounded-lg shadow-xl">
              <div>
                <h1 className="font-bold text-2xl my-2">HQ Address</h1>
                <p>{targetAdmin.hqAddress}</p>
              </div>
              <div>
                <h1 className="font-bold text-2xl mt-4">Shipping Address</h1>
                <p>{targetAdmin.shippingAddress}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-xl p-5 py-20 flex flex-col items-center rounded-xl">
            <div className="mb-6 flex flex-col items-center gap-4">
              <div className="flex justify-between items-center gap-20">
                <h1 className="text-2xl font-bold">Financial Report</h1>
                <Link to={"/financial-reports"} className="text-green-300">
                  View Report
                </Link>
              </div>
              <div>
                <img src="/assets/vendor/report.svg" />
              </div>
              <div className="flex items-center justify-center gap-4">
                <span>Clothes</span>
                <span>Jewelry</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold ">Top Selling</h1>
            <div className="flex justify-around ">
              <div className="flex flex-col ">
                <div className="flex flex-col gap-20">
                  <div className="flex flex-col gap-10 mt-10">
                    <div className="flex gap-8 items-center border p-6 rounded-lg shadow-lg">
                      <div className="rounded-xl w-20 h-20">
                        <img
                          src="/assets/customer/car.svg"
                          className="object-cover w-[100%]"
                        />
                      </div>
                      <div className="flex justify-between  items-center gap-20">
                        <div className="flex flex-col gap-1">
                          <p className="text-lg">
                            Lorem ipsum dolor sit amet consectetur
                          </p>
                          <p className="text-[#1B1B1B80]">1 second ago</p>
                        </div>
                        <div className="flex flex-col  items-center gap-4">
                          <span className="text-2xl">x</span>
                          <span className="text-green-600">$100</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-8 items-center border p-6 rounded-lg shadow-lg">
                      <div className="rounded-xl w-20 h-20">
                        <img
                          src="/assets/customer/car.svg"
                          className="object-cover w-[100%]"
                        />
                      </div>
                      <div className="flex justify-between  items-center gap-20">
                        <div className="flex flex-col gap-1">
                          <p className="text-lg">
                            Lorem ipsum dolor sit amet consectetur
                          </p>
                          <p className="text-[#1B1B1B80]">1 second ago</p>
                        </div>
                        <div className="flex flex-col  items-center gap-4">
                          <span className="text-2xl">x</span>
                          <span className="text-green-600">$100</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-8 items-center border p-6 rounded-lg shadow-lg">
                      <div className="rounded-xl w-20 h-20">
                        <img
                          src="/assets/customer/car.svg"
                          className="object-cover w-[100%]"
                        />
                      </div>
                      <div className="flex justify-between  items-center gap-20">
                        <div className="flex flex-col gap-1">
                          <p className="text-lg">
                            Lorem ipsum dolor sit amet consectetur
                          </p>
                          <p className="text-[#1B1B1B80]">1 second ago</p>
                        </div>
                        <div className="flex flex-col  items-center gap-4">
                          <span className="text-2xl">x</span>
                          <span className="text-green-600">$100</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-8 items-center border p-6 rounded-lg shadow-lg">
                      <div className="rounded-xl w-20 h-20">
                        <img
                          src="/assets/customer/car.svg"
                          className="object-cover w-[100%]"
                        />
                      </div>
                      <div className="flex justify-between  items-center gap-20">
                        <div className="flex flex-col gap-1">
                          <p className="text-lg">
                            Lorem ipsum dolor sit amet consectetur
                          </p>
                          <p className="text-[#1B1B1B80]">1 second ago</p>
                        </div>
                        <div className="flex flex-col  items-center gap-4">
                          <span className="text-2xl">x</span>
                          <span className="text-green-600">$100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorProfile;
