import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go"; // Assuming you're using react-icons for icons
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const AdminsResponsiveTable = ({
  tableData,
  selectAll,
  handleCheckAll,
  selectedObjects,
  handleCheckboxChange,
}) => {
  const [data, setData] = useState(tableData);
  const [sortBy, setSortBy] = useState(null);
  const [sortDesc, setSortDesc] = useState(false);

  const handleSort = (key) => {
    if (key === sortBy) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key);
      setSortDesc(false);
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortBy) {
      const aValue = a[sortBy].toString().toLowerCase();
      const bValue = b[sortBy].toString().toLowerCase();
      if (aValue < bValue) return sortDesc ? 1 : -1;
      if (aValue > bValue) return sortDesc ? -1 : 1;
    }
    return 0;
  });

  const { auth } = useAuth();
  return (
    <div className="overflow-x-auto overflow-y-auto">
      <table className="min-w-full bg-white">
        <thead >
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal ">
            <th className="py-3 px-6 text-left">
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectAll}
                  onChange={handleCheckAll}
                />
              </label>
            </th>
            <SortableHeader
              label="Admin ID"
              onClick={() => handleSort("adminId")}
              sorted={sortBy === "adminId" ? !sortDesc : null}
            />
            <SortableHeader
              label="Name"
              onClick={() => handleSort("name")}
              sorted={sortBy === "name" ? !sortDesc : null}
            />
            <SortableHeader
              label="Email"
              onClick={() => handleSort("email")}
              sorted={sortBy === "email" ? !sortDesc : null}
            />
            <SortableHeader
              label="Phone"
              onClick={() => handleSort("phone")}
              sorted={sortBy === "phone" ? !sortDesc : null}
            />
            <SortableHeader
              label="Age"
              onClick={() => handleSort("dob")}
              sorted={sortBy === "dob" ? !sortDesc : null}
            />
            <SortableHeader
              label="Location"
              onClick={() => handleSort("location")}
              sorted={sortBy === "location" ? !sortDesc : null}
            />
            <SortableHeader
              label="Country"
              onClick={() => handleSort("country")}
              sorted={sortBy === "country" ? !sortDesc : null}
            />
            <SortableHeader
              label="Category"
              onClick={() => handleSort("category")}
              sorted={sortBy === "category" ? !sortDesc : null}
            />
            <SortableHeader
              label="Status"
              onClick={() => handleSort("status")}
              sorted={sortBy === "status" ? !sortDesc : null}
            />
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedData.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedObjects.has(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                  />
                </label>
              </td>
              <td className="py-3 px-6 text-left">{row.id}</td>
              <td className="py-3 px-6 text-left">
                {auth.permissions.find((per) => per === "admin-show") ? (
                  <Link
                    to={`/accounts/Admins/${row.id}`}
                    className="py-5 text-lg"
                  >
                    {row.name}
                  </Link>
                ) : (
                  <p className="py-5 text-lg">{item.name}</p>
                )}
              </td>
              <td className="py-3 px-6 text-left">{row.email}</td>
              <td className="py-3 px-6 text-left">{row.phone}</td>
              <td className="py-3 px-6 text-left">{row.age}</td>
              <td className="py-3 px-6 text-left">{row.address}</td>
              <td className="py-3 px-6 text-left">{row.country}</td>
              <td className="py-3 px-6 text-left">{row.category}</td>
              <td className="py-3 px-6 text-center">
                {row.status === 1 ? (
                  <p className="badge p-4 gap-2 rounded-md text-[#14BA6D] bg-[#ECFDF3]">
                    <GoDotFill className="text-[#14BA6D] text-lg" /> Active
                  </p>
                ) : (
                  <p className="badge p-4 gap-2 rounded-md text-[#E20000] bg-[#F2F4F7]">
                    <GoDotFill className="text-[#E2000099] text-xl" /> Inactive
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SortableHeader = ({ label, onClick, sorted }) => (
  <th className="py-3 px-6 text-left cursor-pointer" onClick={onClick}>
    {label}
    {sorted !== null && (
      <span className={`ml-2 ${sorted ? "text-green-600" : "text-red-600"}`}>
        {sorted ? "↑" : "↓"}
      </span>
    )}
  </th>
);

export default AdminsResponsiveTable;
