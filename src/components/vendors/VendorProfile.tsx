import { useEffect, useState } from "react";
import {  BiEdit, BiTrash } from "react-icons/bi";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../services/api-client";
import { Vendor } from "../../services/vendors-service";
import {  toast } from "react-toastify";
import avatar from "/assets/admin/avatar.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { GoLink } from "react-icons/go";
import customerService from "../../services/customer-service";

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
  phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?\d+$/),
  gender: z.enum(["Male", "female"]),
});
type FormData = z.infer<typeof schema>;
const VendorProfile = () => {
  //Discount Modal

  // const generateRandomCode = () => {
  //   return Math.random().toString(36).substr(2, 8).toUpperCase();
  // };

  // const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  // const [expDate, setExpDate] = useState("");
  // const [discount, setDiscount] = useState("5%");
  // const [code, setCode] = useState(generateRandomCode());

  // const openDiscountModal = () => {
  //   setCode(generateRandomCode());
  //   setIsDiscountModalOpen(true);
  // };

  // const closeDiscountModal = () => {
  //   setIsDiscountModalOpen(false);
  // };

  // const copyCodeToClipboard = () => {
  //   navigator.clipboard.writeText(code);
  //   toast.success("Code copied to clipboard!");
  // };

  // const handleConfirmDiscountDeletion = () => {
  //   (
  //     document.getElementById("deletion-discount-modal") as HTMLDialogElement
  //   ).showModal();
  // };

  const handleDeleteDiscountButton = () => {
    (
      document.getElementById("deletion-discount-modal") as HTMLDialogElement
    ).close();
  };

  // const handleAddingVoucherToCustomer = () => {
  //   //Add Voucher to the API.
  // };

  // const [orders, setOrdersOpen] = useState<boolean>(true);
  // const [rewards, setRewardsOpen] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null | undefined>(
    null
  );
  const [creatingCustomerError, setCreatingCustomerError] =
    useState<string>("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [isSubmittinLoading, setSubmitinLoading] = useState<boolean>(false);
  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);

  const params = useParams();
  const navigate = useNavigate();
  const [targetAdmin, setTargetAdmin] = useState<Vendor>({} as Vendor);
  const [targetAdminError, setTaretAdminError] = useState<string>("");


  // const options: OptionType[] = categories.map((item) => ({
  //   label: item.title,
  //   value: item.title,
  // }));
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
    setPhotoPreview(null);
  };

  useEffect(() => {
    apiClient
      .get<{ data: Vendor }>(`/vendors/${params.id}`)
      .then((res) => {
        setTargetAdmin(res.data.data);
        if (targetAdmin) setPhotoPreview(res.data.data.image);
      })
      .catch((err) => setTaretAdminError(err.message));
  }, []);

  // const [status, setStatus] = useState<string>("Active");

  // const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setStatus(e.target.value);
  // };

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
      const res = apiClient.get(`/vendors/${targetAdmin.id}/switchstatus`, {
        params: { status: newStatus },
      });
      console.log(res);
    } catch (err: any) {
      console.log(err);
    }
  };

  const notify = () => toast.success("Create Admin Successfully!");
  // const [isProductsComponentExist, setIsProductsComponentExist] =
  //   useState(false);
  // const handleAddingOrderToCustomer = () => {
  //   setIsProductsComponentExist(true);
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);

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
      const res = await customerService.create<any>(formData);
      console.log(res);
      setSubmitinLoading(false);
      setIsModalOpen(false);
      notify();
      setTrigerFetch(!trigerFetch);
    } catch (error: any) {
      console.log(error);
      setCreatingCustomerError(error.response.data.data.error);
      setSubmitinLoading(false);
    }
  };

  return (
    <>
      {/* {isProductsComponentExist && <CustomerProductsGrid />} */}
      {isModalOpen && (
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
                    <span className="label-text">Gender</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="address"
                      className={`input input-bordered grow ${
                        errors.gender && "border-[red]"
                      }`}
                      {...register("gender")}
                    />
                    {errors.gender && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
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
                </label>
              </div>
              <div className="modal-action flex justify-around items-center right-80 ">
                <button
                  type="submit"
                  className={`btn px-20 bg-[#577656] text-[white]`}
                >
                  {isSubmittinLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    `Update`
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
              <p className="capitalize">{targetAdmin.shipping_address}</p>
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
              onClick={handleCustomerConfirmationDelete}
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
                  <span className="text-[gray]">
                    {targetAdmin.contact_name}
                  </span>
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
                <p>{targetAdmin.hq_address}</p>
              </div>
              <div>
                <h1 className="font-bold text-2xl mt-4">Shipping Address</h1>
                <p>{targetAdmin.shipping_address}</p>
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
