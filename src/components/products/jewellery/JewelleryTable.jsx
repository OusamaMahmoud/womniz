import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { Link } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";
import { DotIcon } from "lucide-react";

const JewelleryTable = ({
  selectAll,
  handleCheckAll,
  selectedObjects,
  handleCheckboxChange,
  products
}) => {
  const [data, setData] = useState([]);
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
              sorted={sortBy === "id" ? !sortDesc : null}
            />
            <SortableHeader
              label="Model ID"
              onClick={() => handleSort("model_id")}
              sorted={sortBy === "model_id" ? !sortDesc : null}
            />
            <SortableHeader
              label="Product Name"
              onClick={() => handleSort("name")}
              sorted={sortBy === "name" ? !sortDesc : null}
            />
            <SortableHeader
              label="Vendor"
              onClick={() => handleSort("vendor")}
              sorted={sortBy === "vendor" ? !sortDesc : null}
            />
            <SortableHeader
              label="Brand"
              onClick={() => handleSort("brand")}
              sorted={sortBy === "brand" ? !sortDesc : null}
            />
            <SortableHeader
              label="Sub Category"
              onClick={() => handleSort("sub")}
              sorted={sortBy === "sub" ? !sortDesc : null}
            />
            <SortableHeader
              label="Price"
              onClick={() => handleSort("price")}
              sorted={sortBy === "price" ? !sortDesc : null}
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
              <td className="py-3 px-6 text-left xl:text-lg ">{row.id}</td>
              <td className="py-3 px-6 text-left xl:text-lg ">
                {row.model_id}
              </td>
              <Link to={`/products/product-details/${row.id}`}>
                <p className="py-3 px-6 text-left xl:text-lg capitalize">
                  {row.name}
                </p>
              </Link>
              <td className="py-3 px-6 text-left xl:text-lg ">Vendor</td>
              <td className="py-3 px-6 text-left xl:text-lg ">
                {row.brand.name}
              </td>
              <td className="py-3 px-6 text-left xl:text-lg ">
                {row.categories[0]?.name}
              </td>
              <td className="py-3 px-6 text-left xl:text-lg ">{row.price}</td>
              {row.status === "live" ? (
                <td
                  className={`badge bg-[#ECFDF3] py-3 px-6 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#14BA6D]`} /> {row.status}
                </td>
              ) : row.status === "rejected" ? (
                <td
                  className={`badge bg-[#E2000029] py-3 px-6 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#E2000099]`} /> {row.status}
                </td>
              ) : row.status === "deactivated" ? (
                <td
                  className={`badge bg-[#E2000029] py-3 px-6 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#E2000099]`} /> {row.status}
                </td>
              ) : (
                <td
                  className={`badge bg-[#EDEDED] py-3 px-6 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#636366]`} /> {row.status}
                </td>
              )}
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

export default JewelleryTable;
