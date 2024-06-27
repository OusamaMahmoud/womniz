import React, { useEffect, useState } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";
import { FaEdit, FaTrash } from "react-icons/fa";
import "tailwindcss/tailwind.css";
import apiClient from "../../services/api-client";
import { useAuth } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom";

const RoleTable = ({ onEditRole, roles, setRoles, onDeleteRole }) => {
  const data = { nodes: roles };
  const theme = useTheme(getTheme());
  const { auth } = useAuth();
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
    onEditRole(role);
  };

  const handleDelete = (role) => {
    console.log(`delete role: ${role.id}`);
    const formData = new FormData();
    formData.append("_method", "delete");
    const orignalRoles = [...roles];
    try {
      // setLoading(true);
      setRoles(roles.filter((r) => r.id !== role.id));
      const res = apiClient.post(`/roles/${role.id}`, formData);
      console.log(res);
    } catch (error) {
      console.log("error while deleting role!!", error);
    }
  };

  const COLUMNS = [
    {
      label: "Role Name",
      renderCell: (item) =>
        auth?.permissions.find((per) => per === "role-show") ? (
          <Link to={`roles/${item.id}`} className="text-lg">{item.name}</Link>
        ): <span className="text-lg">{item.name}</span>,
      sort: { sortKey: "name" },
    },
    {
      label: "Actions",
      renderCell: (item) => (
        <div className="flex space-x-2">
          {auth?.permissions.find((per) => per === "role-edit") && (
            <button
              onClick={() => handleEdit(item)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit className="text-xl mr-4" />
            </button>
          )}
          {auth?.permissions.find((per) => per === "role-delete") && (
            <button
              onClick={() =>
                document.getElementById("deletion-modal").showModal()
              }
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash className="text-xl " />
            </button>
          )}
          <dialog
            id="deletion-modal"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">Are you sure?</h3>
              <p className="py-4">Do you really want to delete this Role?</p>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() =>
                    document.getElementById("deletion-modal").close()
                  }
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => handleDelete(item)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </dialog>
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
