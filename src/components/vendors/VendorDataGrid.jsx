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
import Pagination from "../Pagination";
import { useAuth } from "../../contexts/AuthProvider";

const VendorDataGrid = ({
  tableData,
  selectAll,
  handleCheckAll,
  selectedAdmins,
  handleCheckboxChange,
  metaObject,
}) => {
  const { auth } = useAuth();
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
      label: "ID",
      renderCell: (item) => <div className=" py-5">{item.id}</div>,
      sort: { sortKey: "id" },
    },
    {
      label: "Vendor Name",
      renderCell: (item) => 
        auth?.permissions.find((per) => per === "vendor-show")  ? (
          <Link to={`/accounts/vendors/${item.id}`} className=" py-5">
            {item.name}
          </Link>
        ) : (
          <p to={`/accounts/vendors/${item.id}`} className=" py-5">
            {item.name}
          </p>
        )
      ,
      sort: { sortKey: "name" },
    },
    {
      label: "Vendor Email",
      renderCell: (item) => item.email,
      sort: { sortKey: "email" },
    },
    {
      label: "Num Of Products",
      renderCell: (item) => item.account_number,
      sort: { sortKey: "email" },
    },
    {
      label: "Commission",
      renderCell: (item) => item.commission,
      sort: { sortKey: "phone" },
    },
    {
      label: "Category",
      renderCell: (item) =>
        item.categories.map((cate) => <span key={cate.id}>{cate.name}</span>),
      sort: { sortKey: "dateOfBirth" },
    },
    {
      label: "Address",
      renderCell: (item) => item.shipping_address,
      sort: { sortKey: "location" },
    },
    {
      label: "Status",
      renderCell: (item) => {
        if (item.status === 1) {
          return (
            <p className="badge flex items-center p-4 gap-2 rounded-md text-[#14BA6D] bg-[#ECFDF3]">
              <GoDotFill className="text-[#14BA6D]  text-lg" /> Active
            </p>
          );
        } else {
          return (
            <p className="badge flex items-center gap-2  p-4 rounded-md text-[#E20000] bg-[#F2F4F7]">
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

export default VendorDataGrid;
