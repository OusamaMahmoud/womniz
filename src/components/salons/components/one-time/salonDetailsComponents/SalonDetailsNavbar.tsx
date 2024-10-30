import { Edit3Icon } from "lucide-react";
import { MdDelete } from "react-icons/md";
const SalonDetailsNavbar = () => {
  return (
    <div className="flex justify-between items-center p-4 shadow-xl rounded-md">
      <div className="flex justify-center items-center gap-3">
        <img
          src="public/assets/admin/avatar.svg"
          alt="profile"
          className="w-20"
        />
        <div>
          <p className="text-xl font-bold">Salon1</p>
          <p className="text-lg">Salon1</p>
          <p className="text-lg">Address</p>
        </div>
      </div>
      <div className="flex gap-4">
        <button className="btn btn-outline">
          <MdDelete /> Delete
        </button>
        <button className="btn  btn-outline">
          <Edit3Icon /> Edit
        </button>
      </div>
    </div>
  );
};

export default SalonDetailsNavbar;
