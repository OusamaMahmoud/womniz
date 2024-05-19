import React from "react";
import { admins } from "../data/dummy";
import { BiExport, BiPlusCircle, BiTrash } from "react-icons/bi";

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  location: string;
  category: string;
  status: string;
}

const Admins: React.FC = () => {
  return (
    <>
      <div className="overflow-x-scroll">
        <div className="flex justify-between items-center">
          <h1 className="font-medium text-4xl capitalize">Admins Details</h1>
          <div className="flex items-center gap-2">
            <button className="capitalize  flex items-center gap-2 text-[white] bg-mainColor text-sm px-4 py-3  rounded-lg ">
              <BiPlusCircle className="text-xl" /> add admin account
            </button>
            <button className="capitalize flex gap-2 px-3 py-2 items-center"><BiTrash className="text-lg"/> delete</button>
            <button className="capitalize flex gap-2 items-center border-[1px] border-[#D0D5DD] p-2 rounded-lg"><BiExport /> export</button>
          </div>
        </div>
        <div></div>
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" disabled />
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
            {admins.map((admin: Admin) => (
              <tr key={admin.id}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.phone}</td>
                <td>{admin.age}</td>
                <td>{admin.location}</td>
                <td>{admin.category}</td>
                <td>{admin.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Admins;
