import { useState } from "react";

const AdminProfile = () => {
  const [status, setStatus] = useState<string>("Active");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
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
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
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
            <option value="Active" >Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
