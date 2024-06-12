import * as React from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";

const CustomersDataGrid = ({
  tableData,
  selectAll,
  handleCheckAll,
  selectedCustomers,
  handleCheckboxChange,
  metaObject,
}) => {
  const data = { nodes: tableData };

  const theme = useTheme(getTheme());

  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortFns: {
        id: (array) => array.sort((a, b) => a.id - b.id),
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
        status: (array) => array.sort((a, b) => a.status - b.status),
      },
    }
  );

  function onSortChange(action, state) {
    console.log(action, state);
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
            checked={selectedCustomers.has(item.id)}
            onChange={() => handleCheckboxChange(item.id)}
          />
        </label>
      ),
    },
    {
      label: <span className="text-sm py-2 mr-2">ID</span>,
      renderCell: (item) => <div className=" py-5">{item.id}</div>,
      sort: { sortKey: "id" },
    },
    {
      label: <span className="text-sm py-2 mr-2">Customer Name</span>,
      renderCell: (item) => (
        <Link to={`/accounts/customers/${item.id}`} className=" py-5">
          {item.name}
        </Link>
      ),
      sort: { sortKey: "name" },
    },
    {
      label: <span className="text-sm py-2 mr-2">Customer Email</span>,
      renderCell: (item) => item.email,
      sort: { sortKey: "email" },
    },
    {
      label: <span className="text-sm py-2 mr-2">Phone Number</span>,
      renderCell: (item) => item.phone,
      sort: { sortKey: "phone" },
    },
    {
      label: <span className="text-sm py-2 mr-2">Age</span>,
      renderCell: (item) => item.age,
      sort: { sortKey: "dateOfBirth" },
    },
    {
      label: <span className="text-sm py-2 mr-2">City</span>,
      renderCell: (item) => item.city,
      sort: { sortKey: "location" },
    },
    {
      label: <span className="text-sm py-2 mr-2">Gender</span>,
      renderCell: (item) => item.gender,
      sort: { sortKey: "country" },
    },
    {
      label: <span className="text-sm py-2 mr-2">Adress</span>,
      renderCell: (item) => (
        <span>
          {item.addresses[0]}-{item.addresses[1]} 
        </span>
      ),
      sort: { sortKey: "category" },
    },
    {
      label: <span className="text-sm py-2 mr-2">Num of Orders</span>,
      renderCell: (item) => 20,
      sort: { sortKey: "category" },
    },
    {
      label: <span className="text-sm py-2 mr-2">Status</span>,
      renderCell: (item) => {
        if (item.status === 0) {
          return (
            <p className="badge flex items-center p-4 gap-2 rounded-md text-[#14BA6D] bg-[#ECFDF3]">
              <GoDotFill className="text-[#14BA6D]  text-lg" /> Active
            </p>
          );
        } else {
          return (
            <p className="badge flex items-center gap-2  p-4 rounded-md text-[#E20000] bg-[#F2F4F7]">
              <GoDotFill className="text-[#E2000099]  text-lg" /> InActive
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

export default CustomersDataGrid;
