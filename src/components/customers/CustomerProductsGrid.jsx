import * as React from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { BiRightArrow, BiSolidRightArrow } from "react-icons/bi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Pagination from "./Pagination";

const CustomerProductsGrid = ({
  tableData,
  selectAll,
  handleCheckAll,
  selectedAdmins,
  handleCheckboxChange,
  metaObject,
}) => {
  const data = { nodes: tableData }; // Update data structure

  const theme = useTheme(getTheme());

  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortFns: {
        id: (array) =>
          array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
        name: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        email: (array) => array.sort((a, b) => a.email.localeCompare(b.email)),
        phone: (array) => array.sort((a, b) => a.phone.localeCompare(b.phone)),
        dateOfBirth: (array) =>
          array.sort(
            (a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth)
          ),
        location: (array) =>
          array.sort((a, b) => a.location.localeCompare(b.location)),
        country: (array) =>
          array.sort((a, b) => a.country.localeCompare(b.country)),
        category: (array) =>
          array.sort((a, b) => a.category.localeCompare(b.category)),
        status: (array) =>
          array.sort((a, b) => a.status.localeCompare(b.status)),
      },
    }
  );

  const COLUMNS = [
    {
      label: (
        <label>
          <input
            type="checkbox"
            className="checkbox"
            checked={selectAll}
            onChange={handleCheckAll}
          />
        </label>
      ),
      renderCell: (item) => (
        <label>
          <input
            type="checkbox"
            className="checkbox"
            checked={selectedAdmins.has(item.id)}
            onChange={() => handleCheckboxChange(item.id)}
          />
        </label>
      ),
    },
    {
      label: <span className="text-xl py-2 mr-2">SKU</span>,
      renderCell: (item) => <div className=" py-5">{item.id}</div>,
      sort: { sortKey: "id" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Product Name</span>,
      renderCell: (item) => (
        <Link to={`/accounts/customers/${item.id}`} className=" py-5">
          {item.name}
        </Link>
      ),
      sort: { sortKey: "name" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Vendor</span>,
      renderCell: (item) => item.email,
      sort: { sortKey: "email" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Category</span>,
      renderCell: (item) => item.phone,
      sort: { sortKey: "phone" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Brand</span>,
      renderCell: (item) => item.age,
      sort: { sortKey: "dateOfBirth" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Quantity</span>,
      renderCell: (item) => item.city,
      sort: { sortKey: "location" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Price</span>,
      renderCell: (item) => item.gender,
      sort: { sortKey: "country" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Discount</span>,
      renderCell: (item) => (
        <span>
          {item.addresses[0]}-{item.addresses[1]} 
        </span>
      ),
      sort: { sortKey: "category" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Status</span>,
      renderCell: (item) => {
        if (item.status === 0) {
          return (
            <p className="flex items-center p-2 gap-2 rounded-md text-[#14BA6D] bg-[#ECFDF3]">
              <GoDotFill className="text-[#14BA6D]  text-lg" /> Active
            </p>
          );
        } else {
          return (
            <p className="flex items-center gap-2  p-2 rounded-md text-[#E20000] bg-[#F2F4F7]">
              <GoDotFill className="text-[#E2000099]  text-xl" /> InActive
            </p>
          );
        }
      },
      sort: { sortKey: "status" },
    },
  ];

  return (
    <>
      <CompactTable columns={COLUMNS} data={data} theme={theme} sort={sort} />
      <br />
    </>
  );
};

export default CustomerProductsGrid;
