import React, { useState, useEffect } from "react";
import { admins } from "../data/dummy";
import {
  BiDotsHorizontalRounded,
  BiExport,
  BiPlusCircle,
  BiTrash,
} from "react-icons/bi";
import avatar from "../assets/admin/avatar.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Controller, FieldValues, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningLine } from "react-icons/ri";
import FileInput from "./FileInput";
import { CgClose, CgEditMask } from "react-icons/cg";
import { FaEdit } from "react-icons/fa";
import useCategories from "../hooks/useCategories";
import { useAuth } from "../contexts/AuthProvider";

// ZOD SCHEMA
const schema = z.object({
  name: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z\s]*$/),
  password: z.string().min(8).max(50),
  phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?\d+$/),
  location: z.string().min(3).max(255),
  country: z.string().min(3).max(100),
  email: z.string().email(),
  dateOfBirth: z
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
  category: z.array(z.string()).min(1),
  photo: z
    .any()
    .refine((file) => file && file.length > 0, "Profile picture is required"),
  status: z.enum(["active", "inactive"]).default("active"),
});

type FormData = z.infer<typeof schema>;

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  country: string;
  category: string | string[];
  status: string;
  password: string;
  photo?: string; // Add photo to the Admin interface
}

const Admins: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>(admins);
  const [selectedAdmins, setSelectedAdmins] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newAdmin, setNewAdmin] = useState<Partial<Admin>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [categoryGroup, setCategoryGroup] = useState<string[]>([]);

  const { categories ,error ,isLoading } = useCategories();

  
  // Handle React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Handle Filters
  useEffect(() => {
    const filtered = admins.filter((admin) => {
      const matchesSearch = admin.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchesCategory = selectedCategory
        ? admin.category === selectedCategory
        : true;
      const matchesStatus = selectedStatus
        ? admin.status.toLowerCase() === selectedStatus.toLowerCase()
        : true;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredAdmins(filtered);
  }, [searchValue, selectedCategory, selectedStatus]);

  const handleDeleteButton = () => {
    const newAdmins = filteredAdmins.filter(
      (admin) => !selectedAdmins.has(admin.id)
    );
    setFilteredAdmins(newAdmins);
    setSelectedAdmins(new Set());
    setSelectAll(false);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedAdmins((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      if (newSelected.size !== filteredAdmins.length) {
        setSelectAll(false);
      }
      return newSelected;
    });
  };

  // Checkboxes
  const handleCheckAll = () => {
    if (selectAll) {
      setSelectedAdmins(new Set());
    } else {
      setSelectedAdmins(new Set(filteredAdmins.map((admin) => admin.id)));
    }
    setSelectAll(!selectAll);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewAdmin({});
    setPhotoPreview(null);
  };

  // Handle Photo Create
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAdmin((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Handle Format Category
  const formatCategories = (categories: string[]) => {
    if (categories.length === 0) return "";
    if (categories.length === 1) return categories[0];
    return (
      categories.slice(0, -1).join(", ") +
      " and " +
      categories[categories.length - 1]
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({
      ...prev,
      [name]: value,
      category: formatCategories(categoryGroup),
      status: "Active",
    }));
  };

  // Handle Category Group in Form
  const handleCategoryGroup = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newCategoryItem = e.target.value;

    setCategoryGroup((prev) => {
      if (prev.includes("")) {
        return prev.filter((cat) => cat !== "");
      }
      if (prev.includes(newCategoryItem)) return [...prev];

      return [
        ...prev.map((item) => item.replace("Management", "")),
        newCategoryItem,
      ];
    });
  };

  // Toastify
  const notify = () => toast.success("Wow so easy!");

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = Math.max(...admins.map((a) => a.id)) + 1;
    const newAdminData = { ...newAdmin, id: newId } as Admin;

    setFilteredAdmins((prev) => [...prev, newAdminData]);
    notify();
    closeModal();
  };

  // Handle Submit
  const onSubmit = (data: FieldValues) => {
    console.log(data);
    setNewAdmin({ ...data });
    const newId = Math.max(...admins.map((a) => a.id)) + 1;
    const newAdminData = { ...newAdmin, id: newId } as Admin;
    console.log(newAdminData);

    setFilteredAdmins((prev) => [...prev, newAdminData]);
    notify();
    closeModal();
  };
  return (
    <div className="overflow-x-scroll p-5">
      <ToastContainer />
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-medium text-4xl capitalize">Admins Details</h1>
        <div className="flex items-center gap-2">
          <button className="btn bg-mainColor text-[white]" onClick={openModal}>
            <BiPlusCircle className="text-xl" /> Add Admin Account
          </button>
          <button
            onClick={handleDeleteButton}
            className="btn btn-outline"
            disabled={selectedAdmins.size === 0}
          >
            <BiTrash className="text-lg" /> Delete
          </button>
          <button className="btn btn-outline">
            <BiExport /> Export
          </button>
        </div>
      </div>

      {/* Handle Filters */}
      <div className="my-6 flex items-center gap-3">
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
        <div className="form-control">
          <select
            className="select select-bordered"
            onChange={(e) => setSelectedCategory(e.target.value)}
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
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectAll}
                  onChange={handleCheckAll}
                />
              </label>
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Location</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map((admin: Admin) => (
            <tr key={admin.id}>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedAdmins.has(admin.id)}
                    onChange={() => handleCheckboxChange(admin.id)}
                  />
                </label>
              </th>
              <td>{admin.id}</td>
              <td className="hover:bg-[#ECFDF3] hover:rounded-md">
                <Link to={"/accounts/Admins/3"}>{admin.name}</Link>{" "}
              </td>
              <td>{admin.email}</td>
              <td>{admin.phone}</td>
              <td>{admin.dateOfBirth}</td>
              <td>{admin.location}</td>
              <td>{admin.category}</td>
              <td>
                <div
                  className={`badge flex gap-1 ${
                    admin.status === "Active"
                      ? "bg-[#ECFDF3] text-[#037847]"
                      : "bg-[#F2F4F7] text-[#E20000] "
                  } `}
                >
                  <BiDotsHorizontalRounded /> {admin.status}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                        errors.dateOfBirth && "border-[red]"
                      }`}
                      {...register("dateOfBirth")}
                    />

                    {errors.dateOfBirth && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
                    )}
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-[red] text-xs mt-3 ">
                      {errors.dateOfBirth.message}
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
                    <span className="label-text">Country</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="country"
                      className={`input input-bordered grow ${
                        errors.country && "border-[red]"
                      }`}
                      {...register("country")}
                    />
                    {errors.email && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
                    )}
                  </div>
                  {errors.country && (
                    <p className="text-[red] text-xs mt-3 ">
                      {errors.country.message}
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
                        errors.email && "border-[red]"
                      }`}
                      {...register("location")}
                    />
                    {errors.email && (
                      <RiErrorWarningLine
                        color="red"
                        className="w-6 h-6 ml-1"
                      />
                    )}
                  </div>
                  {errors.location && (
                    <p className="text-[red] text-xs mt-3 ">
                      {errors.location.message}
                    </p>
                  )}
                </div>
                <div className="form-control ">
                  {/* testing 1*/}

                  {/* <label className="label">
                    <span className="flex grow mr-1 py-3 px-4 rounded-lg label-text text-lg border border-[#c3bebe] -ml-2">
                      Category
                    </span>
                    {errors.category && (
                          <RiErrorWarningLine
                            color="red"
                            className="w-6 h-6 ml-1"
                          />
                        )}
                  </label>
                  <div className="flex flex-col items-start justify-center">
                    {catagories.map((category) => (
                      <div key={category}>
                        <input
                          type="checkbox"
                          id={category}
                          {...register(`category`)}
                          value={category}
                        />
                        <label htmlFor={category} className="pl-3 text-lg">
                          {category}
                        </label>
               
                      </div>
                    ))}
                    {errors.category && (
                      <p className="text-[red] text-xs mt-3 ">
                        {errors.category.message}
                      </p>
                    )}
                  </div> */}

                  {/* testing 2 */}
                  {isLoading && <p className="loading loading-spinner"></p>}
                  {categories &&
                    categories.map((category) => (
                      <div key={category.id}>{category.name}</div>
                      // <select
                      //   id="category"
                      //   {...register("category")}
                      //   className="select select-bordered"
                      //   onChange={handleCategoryGroup}
                      // >
                      //   <option selected disabled>
                      //     Select Category
                      //   </option>
                      //   <option key={category.id} value={category.name}>
                      //     {category.name}
                      //   </option>
                      // </select>
                    ))} 
                  {categoryGroup && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {categoryGroup.map((item) => (
                        <p
                          key={item}
                          className="bg-[#B6C9B5] text-xs flex justify-center items-center p-2 rounded-md  gap-2"
                        >
                          {item} <CgClose color="#577656" />
                        </p>
                      ))}
                    </div>
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
                <Controller
                  name="photo"
                  control={control}
                  render={({ field: { onChange, ref } }) => (
                    <FileInput
                      labelClass="absolute top-40 z-100 right-[330px] flex items-center   gap-3 rounded-md   bg-gray-50 cursor-pointer"
                      name="photo"
                      label="Upload a Profile Picture"
                      multiple={false}
                      onChange={(e) => {
                        handleFileChange(e);
                        onChange(e.target.value);
                      }}
                      ref={ref}
                      icon={<FaEdit />}
                    />
                  )}
                />
              </div>
              <div className="modal-action flex justify-around items-center right-80 ">
                <button
                  type="submit"
                  className={`btn px-20 bg-mainColor text-[white] ${
                    !isValid && "opacity-50 cursor-not-allowed"
                  }}`}
                >
                  Save
                </button>
                <button
                  className={`btn bg-transparent px-20 ${
                    !isValid && "opacity-50 cursor-not-allowed"
                  }}`}
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
