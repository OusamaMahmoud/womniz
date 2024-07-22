import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { Link } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";

const AllProductsTable = ({
  selectAll,
  handleCheckAll,
  selectedObjects,
  handleCheckboxChange,
}) => {
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortDesc, setSortDesc] = useState(false);
  const { products } = useProducts({ category: 8 });

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
      const aValue = a[sortBy].toString().toLowerCase();
      const bValue = b[sortBy].toString().toLowerCase();
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
              label="SKU"
              onClick={() => handleSort("sku")}
              sorted={sortBy === "sku" ? !sortDesc : null}
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
              label="Quantity"
              onClick={() => handleSort("quantity")}
              sorted={sortBy === "quantity" ? !sortDesc : null}
            />
            <SortableHeader
              label="Price"
              onClick={() => handleSort("price")}
              sorted={sortBy === "price" ? !sortDesc : null}
            />
            <SortableHeader
              label="Total Orders Num"
              onClick={() => handleSort("OrdersNum")}
              sorted={sortBy === "OrdersNum" ? !sortDesc : null}
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
              <td className="py-3 px-6 text-left">sku</td>
              <Link to={`product-details/${row.id}`}>
                <td className="py-3 px-6 text-left">{row.name}</td>
              </Link>
              <td className="py-3 px-6 text-left">Vendor</td>
              <td className="py-3 px-6 text-left">{row.brand.name}</td>
              <td className="py-3 px-6 text-left">{row.categories[0]?.name}</td>
              <td className="py-3 px-6 text-left">Quantity</td>
              <td className="py-3 px-6 text-left">{row.price}</td>
              <td className="py-3 px-6 text-left">Orders</td>
              <td className="py-3 px-6 text-left">Status</td>
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
