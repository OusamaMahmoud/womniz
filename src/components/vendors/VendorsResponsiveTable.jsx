import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go"; // Assuming you're using react-icons for icons
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { useTranslation } from "react-i18next";

const VendorsResponsiveTable = ({
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
      const aValue = a[sortBy]?.toString()?.toLowerCase();
      const bValue = b[sortBy]?.toString()?.toLowerCase();
      if (aValue < bValue) return sortDesc ? 1 : -1;
      if (aValue > bValue) return sortDesc ? -1 : 1;
    }
    return 0;
  });

  const { auth } = useAuth();
  const navigate = useNavigate();
  const {t} =useTranslation()
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
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
              label={t("vendors:tableHeader.vendorId")}
              onClick={() => handleSort("adminId")}
              sorted={sortBy == "adminId" ? !sortDesc : null}
            />
            <SortableHeader
              label={t("vendors:tableHeader.name")}
              onClick={() => handleSort("name")}
              sorted={sortBy == "name" ? !sortDesc : null}
            />
            <SortableHeader
              label={t("vendors:tableHeader.email")}
              onClick={() => handleSort("email")}
              sorted={sortBy == "email" ? !sortDesc : null}
            />
            <SortableHeader
              label={t("vendors:tableHeader.nofProducts")}
              onClick={() => handleSort("NOP")}
              sorted={sortBy == "NOP" ? !sortDesc : null}
            />
            <SortableHeader
              label={t("vendors:tableHeader.commission")}
              onClick={() => handleSort("commission")}
              sorted={sortBy == "commission" ? !sortDesc : null}
            />
            <SortableHeader
              label={t("vendors:tableHeader.category")}
              onClick={() => handleSort("category")}
              sorted={sortBy == "category" ? !sortDesc : null}
            />
            <SortableHeader
              label={t("vendors:tableHeader.address")}
              onClick={() => handleSort("address")}
              sorted={sortBy == "address" ? !sortDesc : null}
            />
            <SortableHeader
              label={t("vendors:tableHeader.status")}
              onClick={() => handleSort("status")}
              sorted={sortBy == "status" ? !sortDesc : null}
            />
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedData.map((row) => (
            <tr
              onClick={() => {
                auth?.permissions.find((per) => per === "vendor-show") &&
                  navigate(`/accounts/vendors/${row.id}`);
              }}
              key={row.id}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            >
              <td
                onClick={(e) => e.stopPropagation()}
                className="py-3 px-6 text-left"
              >
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
                {auth?.permissions.find((per) => per === "vendor-show") ? (
                  <Link to={`/accounts/vendors/${row.id}`} className=" py-5">
                    {row.contactName}
                  </Link>
                ) : (
                  <p to={`/accounts/vendors/${row.id}`} className=" py-5">
                    {row.contactName}
                  </p>
                )}
              </td>
              <td className="py-3 px-6 text-left">{row.email}</td>
              <td className="py-3 px-6 text-left">D</td>
              <td className="py-3 px-6 text-left">{row.commission}</td>
              <td className="py-3 px-6 text-left">
                {row.categories.map((cate) => (
                  <span key={cate.id}>{cate.name}</span>
                ))}
              </td>
              <td className="py-3 px-6 text-left">{row.shippingAddress}</td>
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

export default VendorsResponsiveTable;
