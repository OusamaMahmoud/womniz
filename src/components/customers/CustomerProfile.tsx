import { useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../services/api-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import avatar from "../../../public/assets/admin/avatar.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Customer } from "../../services/customer-service";
import { useAuth } from "../../contexts/AuthProvider";

const schema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.union([z.string().length(0), z.string().min(8).max(50)]),
  birthdate: z.string().date(),
  phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?\d+$/),
  gender: z.enum(["Male", "Female"]),
});
type FormData = z.infer<typeof schema>;

const CustomerProfile = () => {
  const { auth } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null | undefined>(
    null
  );
  const [creatingCustomerError, setCreatingCustomerError] =
    useState<string>("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [isSubmittinLoading, setSubmitinLoading] = useState<boolean>(false);

  const params = useParams();
  const navigate = useNavigate();
  const [targetCustomer, setTargetCustomer] = useState<Customer>(
    {} as Customer
  );
  const [targetCustomerError, setTaretCustomerError] = useState<string>("");

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
      .get<{ data: Customer }>(`/users/${params.id}`)
      .then((res) => {
        console.log(res.data.data);
        setTargetCustomer(res.data.data);
        if (targetCustomer) setPhotoPreview(res.data.data.image);
      })
      .catch((err) => setTaretCustomerError(err.message));
  }, []);

  // HANDLE STATUS CHANGE
  const [status, setStatus] = useState<string>("0");

  useEffect(() => {
    setStatus(targetCustomer?.status);
  }, [targetCustomer]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    const newStatus = parseInt(e.target.value);
    try {
      apiClient.get(`/users/${targetCustomer.id}/switchstatus`, {
        params: { status: newStatus },
      });
    } catch (err: any) {
      console.log(err);
    }
  };

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append(`name`, data.name);
    formData.append(`birthdate`, data.birthdate);
    formData.append(`email`, data.email);
    formData.append(`password`, data.password);
    formData.append(`phone`, data.phone);
    formData.append(`gender`, data.gender);
    formData.append(`jobs[0]`, `1`);
    if (imageFile !== null) {
      formData.append(`image`, imageFile);
    }
    formData.append(`status`, "1");
    formData.append(`city`, "");
    formData.append(`addresses`, "");
    formData.append("_method", "PUT");

    try {
      setSubmitinLoading(true);
      const res = await apiClient.post(`/users/${params.id}`, formData);
      if (res.status === 200) {
        setTargetCustomer((prev) => ({
          ...prev,
          ...data,
          image: imageFile ? URL.createObjectURL(imageFile) : prev.image,
        }));
        setPhotoPreview(imageFile && URL.createObjectURL(imageFile));
      }
      toast.success("Your Account has been edited Successfully!");
      setSubmitinLoading(false);
      setIsModalOpen(false);
    } catch (error: any) {
      if (!error?.response) {
        setCreatingCustomerError("No Server Response!!");
        setSubmitinLoading(false);
      } else {
        setCreatingCustomerError(error.response.data.data.error);
        setSubmitinLoading(false);
        setIsModalOpen(false);
      }
    }
  };
  return (
    <>
      {/* {isProductsComponentExist && <CustomerProductsGrid />} */}
      {isModalOpen && (
        <div className="modal modal-open tracking-wide">
          <div className="modal-box max-w-3xl px-10">
            <h3 className="font-bold text-lg text-left">Edit Customer</h3>
            <div className="relative flex justify-center items-center my-8">
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
                      defaultValue={targetCustomer.name}
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
                      defaultValue={targetCustomer.birthdate}
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
                      defaultValue={targetCustomer.phone}
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
                {/* <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      id="email"
                      defaultValue={targetCustomer.email}
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
                </div> */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      id="address"
                      defaultValue={targetCustomer.gender}
                      className={`select select-bordered grow ${
                        errors.gender && "border-[red]"
                      }`}
                      {...register("gender")}
                    >
                      <option value={"Male"}>Male</option>
                      <option value={"Female"}>Female</option>
                    </select>
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
                {/* <div className="form-control">
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
                </div> */}
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
      {targetCustomerError && (
        <p className="text-lg p-2 text-red-600">{targetCustomerError}</p>
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
      <div className="container mx-auto px-5">
        <div className="flex flex-col md:flex-row  justify-between items-center shadow-xl rounded-md p-3 md:p-8">
          <div className="flex gap-3 items-start">
            <div className="w-20 h-20">
              <img
                src={targetCustomer.image}
                alt="avatar"
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            <div className="ml-2">
              <p className="text-xl font-bold capitalize ">
                {targetCustomer.name}
              </p>
              <p className="capitalize">Customer</p>
              <p className="capitalize">{targetCustomer.country}</p>
            </div>
            {auth?.permissions.find((per) => per === "user-change-status") && (
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
          <div className="flex gap-4 mt-6 md:mt-0">
            {auth?.permissions.find((per) => per === "user-delete") && (
              <button
                onClick={handleCustomerConfirmationDelete}
                className="flex items-center gap-2 text-[red] border border-[#d6cccc] rounded-md p-2"
              >
                <BiTrash className="text-xl" />
                Delete
              </button>
            )}
            {auth?.permissions.find((per) => per === "user-edit") && (
              <button
                onClick={handleEditButton}
                className="flex items-center gap-2  border border-[#d6cccc] rounded-md py-2 px-[18px]"
              >
                <BiEdit className="text-xl" /> Edit
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row  items-start gap-4 mt-20">
          <div className="md:w-[600px] w-[350px]">
            <div className=" p-5  rounded-lg shadow-xl">
              <h1 className="font-bold text-2xl mt-2">Personal Information</h1>
              <div className="flex justify-between max-w-xs mt-5">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-lg opacity-50">Name</span>
                  <span>{targetCustomer.name}</span>
                </div>
                <div className="flex flex-col gap-1 mt-5">
                  <span className="font-bold text-lg opacity-50">
                    Date of Birth
                  </span>
                  <span className="text-[gray]">
                    {targetCustomer.birthdate}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-5">
                <span className="font-bold text-lg opacity-50">Email</span>
                <span className="text-[gray]">{targetCustomer.email}</span>
              </div>
              <div className="flex flex-col gap-1 mt-5">
                <span className="font-bold text-lg opacity-50">
                  Phone Number
                </span>
                <span className="text-[gray]">{targetCustomer.phone}</span>
              </div>
              <div className="flex flex-col gap-1 mt-5">
                <span className="font-bold text-lg opacity-50">Bio</span>
                <span className="text-[gray]">Customer</span>
              </div>
            </div>
          </div>
          {targetCustomer?.addresses?.map((item) => (
            <div
              key={item.id}
              className=" p-5  rounded-lg shadow-xl w-[350px] md:w-[600px] "
            >
              <h1 className="font-bold text-2xl mt-2">Customer Address</h1>
              <div className="flex gap-3 items-center flex-wrap mt-2">
                <p className="font-bold text-lg opacity-50">Place:</p>
                <p>{item.label}</p>
              </div>
              <div className="flex gap-3 items-center flex-wrap mt-3">
                <p className="font-bold text-lg opacity-50">Apartment Floor:</p>
                <p>{item.apt_floor}</p>
              </div>
              <div className="flex gap-3 items-center flex-wrap mt-3">
                <p className="font-bold text-lg opacity-50">Map Address:</p>
                <p>{item.map_address}</p>
              </div>
              <div className="flex gap-3 items-center flex-wrap mt-3">
                <p className="font-bold text-lg opacity-50">Street Address:</p>
                <p>{item.street_address}</p>
              </div>
              <div className="flex gap-3 items-center flex-wrap mt-3">
                <p className="font-bold text-lg opacity-50">latitude:</p>
                <p>{item.lat}</p>
              </div>
              <div className="flex gap-3 items-center flex-wrap mt-3">
                <p className="font-bold text-lg opacity-50">longitude: </p>
                <p>{item.long}</p>
              </div>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default CustomerProfile;
