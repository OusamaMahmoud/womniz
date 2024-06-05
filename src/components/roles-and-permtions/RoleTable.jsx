import React, { useState } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";
import { FaEdit, FaTrash } from "react-icons/fa";
import "tailwindcss/tailwind.css";

const RoleTable = () => {
  const initialData = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Editor" },
    { id: 3, name: "Viewer" },
  ];

  const [roles, setRoles] = useState(initialData);
  const data = { nodes: roles };
  const theme = useTheme(getTheme());

  const sort = useSort(
    data,
    { onChange: onSortChange },
    {
      sortFns: {
        name: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
      },
    }
  );

  function onSortChange(action, state) {
    // console.log(action, state);
  }

  const handleEdit = (role) => {
    console.log(`Edit role: ${role.name}`);
  };

  const handleDelete = (role) => {
    setRoles(roles.filter((r) => r.id !== role.id));
  };

  const COLUMNS = [
    {
      label: "Role Name",
      renderCell: (item) => <span className="text-lg">{item.name}</span>,
      sort: { sortKey: "name" },
    },
    {
      label: "Actions",
      renderCell: (item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(item)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto mt-5">
      <CompactTable columns={COLUMNS} data={data} theme={theme} sort={sort} />
    </div>
  );
};

export default RoleTable;
