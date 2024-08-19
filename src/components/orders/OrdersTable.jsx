import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import { DotIcon } from "lucide-react";
import Pagination from "../Pagination";

const OrdersTable = ({
  selectAll,
  handleCheckAll,
  selectedObjects,
  handleCheckboxChange,
  products,
  serverErrors,
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
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto overflow-y-auto ">
      <table className="min-w-full bg-white border">
        {!serverErrors && (
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
                label="Date"
                onClick={() => handleSort("date")}
                sorted={sortBy === "date" ? !sortDesc : null}
              />
              <SortableHeader
                label="Order Num"
                onClick={() => handleSort("order_num")}
                sorted={sortBy === "order_num" ? !sortDesc : null}
              />
              <SortableHeader
                label="Customer"
                onClick={() => handleSort("customer")}
                sorted={sortBy === "customer" ? !sortDesc : null}
              />
              <SortableHeader
                label="Number of Items"
                onClick={() => handleSort("number_of_items")}
                sorted={sortBy === "number_of_items" ? !sortDesc : null}
              />
              <SortableHeader
                label="Price"
                onClick={() => handleSort("price")}
                sorted={sortBy === "price" ? !sortDesc : null}
              />
              <SortableHeader
                label="Discount"
                onClick={() => handleSort("discount")}
                sorted={sortBy === "discount" ? !sortDesc : null}
              />
              <SortableHeader
                label="Status"
                onClick={() => handleSort("status")}
                sorted={sortBy === "status" ? !sortDesc : null}
              />
            </tr>
          </thead>
        )}
        <tbody className="text-gray-600 text-sm font-light">
          {sortedData.map((row) => (
            <tr
              key={row?.id}
              onClick={() => navigate(`/orders/orders-details/${row?.id}`)}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            >
              <td className="py-3 px-6 text-left">
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedObjects.has(row?.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(row?.id);
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevents the row click event
                  />
                </label>
              </td>
              <td className="py-3 px-6 text-left xl:text-lg ">{row?.date}</td>

              <td className="py-3 px-6 text-left xl:text-lg ">{row?.id}</td>

              <td className="py-3 px-6 text-left xl:text-lg capitalize">
                {row?.customer}
              </td>

              <td className="py-3 px-6 text-left xl:text-lg ">
                {row?.numberOfItems}
              </td>
              <td className="py-3 px-6 text-left xl:text-lg ">{row?.total}</td>
              <td className="py-3 px-6 text-left xl:text-lg ">
                {row?.discount}
              </td>

              {row?.status === "pending" ? (
                <td
                  className={`badge bg-[#ECFDF3] my-3 py-5 px-3 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#14BA6D]`} /> {row?.status}
                </td>
              ) : row?.status === "canceled" ? (
                <td
                  className={`badge bg-[#E2000029] my-3 py-5 px-3 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#E2000099]`} />{" "}
                  {row?.status}
                </td>
              ) : row?.status === "delivery_failed" ? (
                <td
                  className={`badge bg-[#E2000029] my-3 py-5 px-3 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#E2000099]`} />{" "}
                  {row?.status}
                </td>
              ) : row?.status === "returned" ? (
                <td
                  className={`badge bg-[#ECFDF3] text-[#F0CC4E] my-3 py-5 px-3 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#F0CC4E99]`} />{" "}
                  {row?.status}
                </td>
              ) : row.status === "delivered" ? (
                <td
                  className={`badge bg-#ECFDF3] text-[#037847] my-3 py-5 px-3 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#14BA6D]`} /> {row.status}
                </td>
              ) : row?.status === "ready_to_ship" ? (
                <td
                  className={`badge bg-[#7F9B8D29] text-[#7F9B8D] my-3 py-5 px-3 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#7F9B8D]`} /> {row?.status}
                </td>
              ) : (
                <td
                  className={`badge bg-#ECFDF3] text-[#037847] my-3 py-5 px-3 text-left xl:text-lg `}
                >
                  <GoDotFill className={`mr-1 text-[#14BA6D]`} /> {row?.status}
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

export default OrdersTable;
