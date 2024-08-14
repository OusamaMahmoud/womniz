import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "tailwindcss/tailwind.css";
import apiClient from "../../services/api-client";
import { useAuth } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom";

const ResponsiveRoleTable = ({ onEditRole, roles, setRoles, onDeleteRole }) => {
  const { auth } = useAuth();

  const handleEdit = (role) => {
    onEditRole(role);
  };

  const handleDelete = (role) => {
    const formData = new FormData();
    formData.append("_method", "delete");
    const originalRoles = [...roles];
    try {
      setRoles(roles.filter((r) => r.id !== role.id));
      const res = apiClient.post(`/roles/${role.id}`, formData);
    } catch (error) {
      setRoles(originalRoles);
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left">
              Role Name
            </th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b border-gray-300">
                {auth?.permissions.find((per) => per === "role-show") ? (
                  <Link to={`roles/${role.id}`} className="text-lg">
                    {role.name}
                  </Link>
                ) : (
                  <span className="text-lg">{role.name}</span>
                )}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                <div className="flex space-x-2">
                  {auth?.permissions.find((per) => per === "role-edit") && (
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit className="text-xl mr-4" />
                    </button>
                  )}
                  {auth?.permissions.find((per) => per === "role-delete") && (
                    <>
                      <button
                        onClick={() =>
                          document
                            .getElementById(`deletion-modal-${role.id}`)
                            .showModal()
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                      <dialog
                        id={`deletion-modal-${role.id}`}
                        className="modal modal-bottom sm:modal-middle"
                      >
                        <div className="modal-box">
                          <h3 className="font-bold text-lg">Are you sure?</h3>
                          <p className="py-4">
                            Do you really want to delete this Role?
                          </p>
                          <div className="modal-action">
                            <button
                              className="btn"
                              onClick={() =>
                                document
                                  .getElementById(`deletion-modal-${role.id}`)
                                  .close()
                              }
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-error"
                              onClick={() => {
                                handleDelete(role);
                                document
                                  .getElementById(`deletion-modal-${role.id}`)
                                  .close();
                              }}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </dialog>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveRoleTable;
