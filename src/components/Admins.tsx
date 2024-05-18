import React from "react";
import moment from "moment";
import CardTitle from "./CardTitle";
import { admins } from "../data/dummy";
import { BiPlug } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";

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
    <CardTitle title="Admins" topMargin="mt-2" TopSideButtons={'Add admin account'} icon={<PiPlusCircle />}>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
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
    </CardTitle>
  );
};

export default Admins;
