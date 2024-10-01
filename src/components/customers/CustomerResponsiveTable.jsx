import React, { useState, useMemo } from "react";
import { GoDotFill } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

const CustomerResponsiveTable = ({
  tableData,
  selectAll,
  handleCheckAll,
  selectedObjects,
  handleCheckboxChange,
}) => {
  const [data, setData] = useState(tableData);
  const [sortBy, setSortBy] = useState("name"); // Default sort by name
  const [sortDesc, setSortDesc] = useState(false);

  const handleSort = (key) => {
    if (key === sortBy) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key);
      setSortDesc(false);
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortBy) {
        const aValue = (a[sortBy] ?? "")?.toString();
        const bValue = (b[sortBy] ?? "")?.toString();
        return sortDesc
          ? bValue.localeCompare(aValue, undefined, { sensitivity: "base" })
          : aValue.localeCompare(bValue, undefined, { sensitivity: "base" });
      }
      return 0;
    });
  }, [data, sortBy, sortDesc]);

  const { auth } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto overflow-y-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
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
              label="ID"
              onClick={() => handleSort("id")}
              sorted={sortBy === "id" ? (sortDesc ? "desc" : "asc") : null}
            />
            <SortableHeader
              label="Name"
              onClick={() => handleSort("name")}
              sorted={sortBy === "name" ? (sortDesc ? "desc" : "asc") : null}
            />
            <SortableHeader
              label="Email"
              onClick={() => handleSort("email")}
              sorted={sortBy === "email" ? (sortDesc ? "desc" : "asc") : null}
            />
            <SortableHeader
              label="Phone"
              onClick={() => handleSort("phone")}
              sorted={sortBy === "phone" ? (sortDesc ? "desc" : "asc") : null}
            />
            <SortableHeader
              label="Age"
              onClick={() => handleSort("age")}
              sorted={sortBy === "age" ? (sortDesc ? "desc" : "asc") : null}
            />
            <SortableHeader
              label="City"
              onClick={() => handleSort("city")}
              sorted={sortBy === "city" ? (sortDesc ? "desc" : "asc") : null}
            />
            <SortableHeader
              label="Gender"
              onClick={() => handleSort("gender")}
              sorted={sortBy === "gender" ? (sortDesc ? "desc" : "asc") : null}
            />
            <SortableHeader
              label="Address"
              onClick={() => handleSort("address")}
              sorted={sortBy === "address" ? (sortDesc ? "desc" : "asc") : null}
            />
            <SortableHeader
              label="Num Of Orders"
              onClick={() => handleSort("numOfOrders")}
              sorted={
                sortBy === "numOfOrders" ? (sortDesc ? "desc" : "asc") : null
              }
            />
            <SortableHeader
              label="Status"
              onClick={() => handleSort("status")}
              sorted={sortBy === "status" ? (sortDesc ? "desc" : "asc") : null}
            />
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedData.map((row) => (
            <tr
              onClick={() => {
                auth?.permissions.find((per) => per === "user-show") &&
                  navigate(`/accounts/customers/${row?.id}`);
              }}
              key={row?.id}
              className="border-b cursor-pointer border-gray-200 hover:bg-gray-100"
            >
              <td
                onClick={(e) => e.stopPropagation()}
                className="py-3 px-6 text-left"
              >
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedObjects.has(row?.id)}
                    onChange={() => handleCheckboxChange(row?.id)}
                  />
                </label>
              </td>
              <td className="py-3 px-6 text-left">{row?.id}</td>
              <td className="py-3 px-6 text-left">{row?.name}</td>
              <td className="py-3 px-6 text-left">{row?.email}</td>
              <td className="py-3 px-6 text-left">{row?.phone}</td>
              <td className="py-3 px-6 text-left">{row?.age}</td>
              <td className="py-3 px-6 text-left">{row?.city}</td>
              <td className="py-3 px-6 text-left">{row?.gender}</td>
              <td className="py-3 px-6 text-left">
                {row?.addresses &&
                  row?.addresses?.length > 0 &&
                  row?.addresses?.map((add, index) => (
                    <p
                      key={add?.label}
                      className="text-center flex justify-center items-center pr-10"
                    >
                      {add?.label}
                    </p>
                  ))}
              </td>
              <td className="py-3 px-6 text-left">{row?.numOfOrders}</td>
              <td className="py-3 px-6 text-center">
                {row?.status === 1 ? (
                  <p className="badge p-4 gap-2 rounded-md text-[#14BA6D] bg-[#ECFDF3]">
                    <GoDotFill
                      className="text-[#14BA6D] text-lg"
                      aria-hidden="true"
                    />
                    <span>Active</span>
                  </p>
                ) : (
                  <p className="badge p-4 gap-2 rounded-md text-[#E20000] bg-[#F2F4F7]">
                    <GoDotFill
                      className="text-[#E2000099] text-xl"
                      aria-hidden="true"
                    />
                    <span>Inactive</span>
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
  <th
    className="py-3 px-6 text-left cursor-pointer"
    onClick={onClick}
    aria-sort={sorted}
  >
    {label}
    {sorted && (
      <span
        className={`ml-2 ${
          sorted === "asc" ? "text-green-600" : "text-red-600"
        }`}
        aria-hidden="true"
      >
        {sorted === "asc" ? "↑" : "↓"}
      </span>
    )}
  </th>
);

export default CustomerResponsiveTable;
