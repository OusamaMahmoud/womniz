import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";
import { DotIcon } from "lucide-react";

const AllProductsTable = ({
  selectAll,
  handleCheckAll,
  selectedObjects,
  handleCheckboxChange,
  products,
}) => {
  const [data, setData] = useState(products);
  const [sortBy, setSortBy] = useState(null);
  const [sortDesc, setSortDesc] = useState(false);

  useEffect(() => {
    setData(products);
  }, [products]);

  const handleSort = (key) => {
    if (key === sortBy) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key);
      setSortDesc(false);
    }
  };
  const navigate = useNavigate();

  const sortedData = [...data].sort((a, b) => {
    if (sortBy) {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different types
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (aValue instanceof Date) {
        return sortDesc ? bValue - aValue : aValue - bValue;
      }

      if (aValue < bValue) return sortDesc ? 1 : -1;
      if (aValue > bValue) return sortDesc ? -1 : 1;
    }
    return 0;
  });
  return (
    <div className="overflow-x-auto overflow-y-auto ">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal ">
            <th className="py-3 px-6 text-left">
              <input
                type="checkbox"
                className="checkbox"
                checked={selectAll}
                onChange={handleCheckAll}
              />
            </th>
            <SortableHeader
              label="ID"
              onClick={() => handleSort("id")}
              sorted={sortBy == "id" ? !sortDesc : null}
            />
            <SortableHeader
              label="Model ID"
              onClick={() => handleSort("model_id")}
              sorted={sortBy == "model_id" ? !sortDesc : null}
            />
            <SortableHeader
              label="Product Name"
              onClick={() => handleSort("name")}
              sorted={sortBy == "name" ? !sortDesc : null}
            />
            <SortableHeader
              label="Vendor"
              onClick={() => handleSort("vendor")}
              sorted={sortBy == "vendor" ? !sortDesc : null}
            />
            <SortableHeader
              label="Brand"
              onClick={() => handleSort("brand")}
              sorted={sortBy == "brand" ? !sortDesc : null}
            />
            <SortableHeader
              label="Category"
              onClick={() => handleSort("cat")}
              sorted={sortBy == "cat" ? !sortDesc : null}
            />
            <SortableHeader
              label="Price"
              onClick={() => handleSort("price")}
              sorted={sortBy == "price" ? !sortDesc : null}
            />
            <SortableHeader
              label="Status"
              onClick={() => handleSort("status")}
              sorted={sortBy == "status" ? !sortDesc : null}
            />
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedData?.map((row) => (
            <tr
              key={row.id}
              onClick={() => navigate(`/product-details/${row?.id}`)}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            >
              <td
                onClick={(e) => e.stopPropagation()} // Prevents the row click event>
                className="py-3 px-6 text-left"
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedObjects.has(row.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(row?.id);
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevents the row click event
                />
              </td>
              <td className="py-3 px-6 text-left xl:text-lg ">{row?.id}</td>
              <td className="py-3 px-6 text-left xl:text-lg ">
                {row?.model_id}
              </td>

              <td className="py-3 px-6 text-left xl:text-lg capitalize">
                {row?.name}
              </td>

              <td className="py-3 px-6 text-left xl:text-lg ">
                {row?.vendor?.contactName}
              </td>
              <td className="py-3 px-6 text-left xl:text-lg ">
                {row?.brand?.name}
              </td>
              <td className="py-3 px-6 text-left xl:text-lg ">
                {row?.product_type}
              </td>
              <td className="py-3 px-6 text-left xl:text-lg ">{row?.price}</td>
              <td className={`py-3 px-6 text-left xl:text-lg`}>
                <p className=" flex items-center bg-[#53f2a8] w-fit px-4 py-1 rounded-md gap-1">
                  <GoDotFill className={`mr-1 text-[#14BA6D]`} /> {row?.status}
                </p>
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

export default AllProductsTable;
