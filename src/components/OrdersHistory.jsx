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

const OrdersHistory = ({
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
      label: <span className="text-xl py-2 mr-2">Date</span>,
      renderCell: (item) => <div className=" py-5">{item.id}</div>,
      sort: { sortKey: "id" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Order Num</span>,
      renderCell: (item) => {
        item.name;
      },
      sort: { sortKey: "name" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Number of Items</span>,
      renderCell: (item) => item.email,
      sort: { sortKey: "email" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Price</span>,
      renderCell: (item) => item.phone,
      sort: { sortKey: "phone" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Discount Womniz Only</span>,
      renderCell: (item) => item.age,
      sort: { sortKey: "dateOfBirth" },
    },
    {
      label: <span className="text-xl py-2 mr-2">Status</span>,
      renderCell: (item) => (
        <span className="badge bg-[#F0CC4E29] text-[#F0CC4E] p-4">
          Confirmed
        </span>
      ),
      sort: { sortKey: "location" },
    },
  ];

  return (
    <>
      <CompactTable columns={COLUMNS} data={data} theme={theme} sort={sort} />
      <br />
    </>
  );
};

export default OrdersHistory;
