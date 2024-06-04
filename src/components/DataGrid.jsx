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

const DataGrid = ({
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

  function onSortChange(action, state) {
    // console.log(action, state);
  }

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
      label: "Admin ID",
      renderCell: (item) => <div className=" py-5">{item.id}</div>,
      sort: { sortKey: "id" },
    },
    {
      label: "Name",
      renderCell: (item) => (
        <Link to={`/accounts/Admins/${item.id}`} className="py-5 text-lg">
          {item.name}
        </Link>
      ),
      sort: { sortKey: "name" },
    },
    {
      label: "Email",
      renderCell: (item) => <span className="text-lg">{item.email}</span>,
      sort: { sortKey: "email" },
    },
    {
      label: "Phone",
      renderCell: (item) => <span className="text-lg">{item.phone}</span>,
      sort: { sortKey: "phone" },
    },
    {
      label: "Date of Birth",
      renderCell: (item) => <span className="text-lg">{item.age}</span>,
      sort: { sortKey: "dateOfBirth" },
    },
    {
      label: "Location",
      renderCell: (item) => <span className="text-lg">{item.address}</span>,
      sort: { sortKey: "location" },
    },
    {
      label: "Country",
      renderCell: (item) => <span className="text-lg">{item.country}</span>,
      sort: { sortKey: "country" },
    },
    {
      label: "Category",
      renderCell: (item) => <span className="text-lg">{item.category}</span>,
      sort: { sortKey: "category" },
    },
    {
      label: "Status",
      renderCell: (item) => {
        if (item.status === 0) {
          return (
            <p className="badge  p-4 gap-2 rounded-md text-[#14BA6D] bg-[#ECFDF3]">
              <GoDotFill className="text-[#14BA6D]  text-lg" /> Active
            </p>
          );
        } else {
          return (
            <p className="badge  p-4 gap-2 rounded-md  text-[#E20000] bg-[#F2F4F7]">
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

export default DataGrid;
