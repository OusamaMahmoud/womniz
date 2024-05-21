import { useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";

const AdminProfile = () => {
  const [status, setStatus] = useState<string>("Active");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleEditButton = () => {
    
  };

  const getBackgroundColor = () => {
    if (status === "Active") {
      return "bg-[#ECFDF3]"; // Green background for Active
    } else if (status === "Inactive") {
      return "bg-[#FDECEC]"; // Red background for Inactive
    } else {
      return "bg-white"; // Default background
    }
  };
  return (
    <div className="container mx-auto px-5">
      <div className="flex justify-between items-center shadow-xl p-8">
        <div className="flex gap-3 items-start">
          <img src="/src/assets/admin/avatarInfo.svg" alt="avatar" />
          <div className="ml-2">
            <p className="text-xl font-bold ">Charles Tea</p>
            <p className="capitalize">Product, Jewelry Management</p>
            <p className="capitalize">Saudi Arabia</p>
          </div>
          <select
            className={`select select-bordered ml-4 ${getBackgroundColor()}`}
            value={status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-[red] border border-[#d6cccc] rounded-md p-2">
            <BiTrash className="text-xl" />
            Delete
          </button>
          <button
          onClick={handleEditButton}
          className="flex items-center gap-2  border border-[#d6cccc] rounded-md py-2 px-[18px]">
            <BiEdit className="text-xl" /> Edit
          </button>
        </div>
      </div>
      <div className="mt-20 p-10  rounded-lg shadow-xl">
        <h1 className="font-bold text-xl">Personal Information</h1>
        <div className="flex justify-between max-w-xs mt-5">
          <div className="flex flex-col gap-1">
            <span className="font-bold">Name</span>
            <span>Ahmed Sayed</span>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <span className="font-bold">Date of Birth</span>
            <span className="text-[gray]">31/10/1998</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-5">
          <span className="font-bold">Email</span>
          <span className="text-[gray]">AhmedSayed@gmail.com</span>
        </div>
        <div className="flex flex-col gap-1 mt-5">
          <span className="font-bold">Phone Number</span>
          <span className="text-[gray]">0123456789</span>
        </div>
        <div className="flex flex-col gap-1 mt-5">
          <span className="font-bold">Bio</span>
          <span className="text-[gray]">Product, Jewelry Management</span>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
