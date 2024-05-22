import * as React from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
import { Link } from "react-router-dom";

const DataGrid = ({
  tableData,
  selectAll,
  handleCheckAll,
  selectedAdmins,
  handleCheckboxChange,
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
    console.log(action, state);
  }

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 5, // Adjust the size as needed
    },
    onChange: onPaginationChange,
  });

  function onPaginationChange(action, state) {
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
      renderCell: (item) => <div className=" py-5">{item.name}</div>,
      sort: { sortKey: "name" },
    },
    {
      label: "Email",
      renderCell: (item) => item.email,
      sort: { sortKey: "email" },
    },
    {
      label: "Phone",
      renderCell: (item) => item.phone,
      sort: { sortKey: "phone" },
    },
    {
      label: "Date of Birth",
      renderCell: (item) => item.dateOfBirth,
      sort: { sortKey: "dateOfBirth" },
    },
    {
      label: "Location",
      renderCell: (item) => item.location,
      sort: { sortKey: "location" },
    },
    {
      label: "Country",
      renderCell: (item) => item.country,
      sort: { sortKey: "country" },
    },
    {
      label: "Category",
      renderCell: (item) => item.category,
      sort: { sortKey: "category" },
    },
    {
      label: "Status",
      renderCell: (item) => item.status,
      sort: { sortKey: "status" },
    },
  ];

  return (
    <>
      <CompactTable
        columns={COLUMNS}
        data={data}
        theme={theme}
        sort={sort}
        pagination={pagination}
      />
      <br />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Total Pages: {pagination.state.getTotalPages(data.nodes)}</span>
        <span>
          Page:{" "}
          {pagination.state.getPages(data.nodes).map((_, index) => (
            <button
              key={index}
              type="button"
              style={{
                fontWeight: pagination.state.page === index ? "bold" : "normal",
              }}
              onClick={() => pagination.fns.onSetPage(index)}
            >
              {index + 1}
            </button>
          ))}
        </span>
      </div>
    </>
  );
};

export default DataGrid;
