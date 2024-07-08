import React, { useEffect, useState } from "react";
import { BiExport, BiPlus } from "react-icons/bi";
import RoleTable from "./RoleTable";
import usePermissions from "../../hooks/usePremissions";
import { FieldValues, useForm } from "react-hook-form";
import { Role } from "../../services/role-service";
import useRoles from "../../hooks/useRoles";
import EditRole from "./EditRole";
import apiClient from "../../services/api-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/AuthProvider";

const Roles: React.FC = () => {
  const { permissions, setPermissions } = usePermissions();
  const { roles, setRoles } = useRoles();
  const [targetRole, setTargetRole] = useState<Role | null>({} as Role);
  const [isCreatingRolePageShow, setCreatingRolePageShow] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  const [searchKey, setSearchKey] = useState<string>("");
  const [filteredRoles, setFilteredRoles] = useState<Role[]>(roles);

  useEffect(() => {
    if (searchKey === "") {
      setFilteredRoles(roles);
    } else {
      setFilteredRoles(
        roles.filter((role) =>
          role.name.toLowerCase().includes(searchKey.toLowerCase())
        )
      );
    }
  }, [searchKey, roles]);

  const handleCheckboxChange = (
    categoryIndex: number,
    permissionIndex: number
  ) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[categoryIndex].permissions[permissionIndex].checked =
      !updatedPermissions[categoryIndex].permissions[permissionIndex].checked;
    setPermissions(updatedPermissions);
  };

  const handleSelectCategoryChange = (
    categoryIndex: number,
    isChecked: boolean
  ) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[categoryIndex].permissions = updatedPermissions[
      categoryIndex
    ].permissions.map((permission) => ({
      ...permission,
      checked: isChecked,
    }));
    setPermissions(updatedPermissions);
  };

  const handleSelectAllChange = (isChecked: boolean) => {
    const updatedPermissions = permissions.map((category) => ({
      ...category,
      permissions: category.permissions.map((permission) => ({
        ...permission,
        checked: isChecked,
      })),
    }));
    setPermissions(updatedPermissions);
    setSelectAll(isChecked);
  };

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: FieldValues) => {
    const selectedPermissions = permissions.flatMap((category) =>
      category.permissions
        .filter((permission) => permission.checked)
        .map((permission) => permission.name)
    );

    const formData = new FormData();
    formData.append("name", data.ro);
    selectedPermissions.map((per, idx) => {
      formData.append(`permissions[${idx}]`, per);
    });

    // Send `selectedPermissions` to the API
    try {
      apiClient.post("/roles", formData);
      toast.success(`${data.ro} Role is Successfully Created.`);
      setCreatingRolePageShow(false);
    } catch (error) {
    }
  };
  const { auth } = useAuth();

  return (
    <>
      <ToastContainer />
      {/* MAIN PAGE */}
      {!targetRole?.name && (
        <div className="container mx-auto px-6">
          {!isCreatingRolePageShow && (
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Roles</h1>
                <div className="flex gap-4 items-center">
                  {auth?.permissions.find((per) => per === "role-create") && (
                    <button
                      onClick={() => setCreatingRolePageShow(true)}
                      className="btn btn-outline flex gap-1"
                    >
                      <BiPlus /> Add Role
                    </button>
                  )}
                </div>
              </div>
              <label className="input input-bordered flex items-center gap-2 mt-4 w-fit">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.currentTarget.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
              <div>
                <RoleTable
                  onEditRole={(role: Role) => setTargetRole(role)}
                  onDeleteRole={(role: Role) => setTargetRole(role)}
                  roles={filteredRoles}
                  setRoles={setRoles}
                />
              </div>
            </div>
          )}

          {/* CREATE Role FORM */}
          {isCreatingRolePageShow && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className="text-4xl font-semibold">Create Roles</h1>
              <div className="flex items-center justify-between ">
                <div className="mt-8">
                  <p className="text-2xl font-bold  mb-2">Role Name</p>
                  <input
                    {...register("ro")}
                    id="ro"
                    type="text"
                    className="input input-bordered grow min-w-96"
                  />
                </div>
                <div className="form-control w-36">
                  <label className="cursor-pointer label">
                    <span className="label-text">Select All</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={selectAll}
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                    />
                  </label>
                </div>
              </div>
              <div>
                {permissions.map((category, categoryIndex) => (
                  <div
                    key={category.grouping}
                    className="border rounded-md p-4 shadow-lg mt-6"
                  >
                    <div className="flex justify-between items-center ">
                      <h1 className="text-2xl font-semibold ">
                        {category.grouping}
                      </h1>
                      <span>
                        <input
                          type="checkbox"
                          className="toggle toggle-success"
                          checked={category.permissions.every(
                            (permission) => permission.checked
                          )}
                          onChange={(e) =>
                            handleSelectCategoryChange(
                              categoryIndex,
                              e.target.checked
                            )
                          }
                        />
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                      {category.permissions.map(
                        (permission, permissionIndex) => (
                          <label
                            key={permission.name}
                            className="cursor-pointer label w-full sm:w-auto"
                          >
                            <input
                              type="checkbox"
                              checked={permission.checked}
                              onChange={() =>
                                handleCheckboxChange(
                                  categoryIndex,
                                  permissionIndex
                                )
                              }
                              className="checkbox checkbox-success"
                            />
                            <span className="label-text text-lg ml-4">
                              {permission.name}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline  text-lg mt-6 mr-4">
                Cancel
              </button>
              <button
                className="btn bg-[#577656] text-white font-medium text-lg mt-6"
                type="submit"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      )}

      {/* EDIT FORM */}
      {targetRole && targetRole.name && (
        <EditRole
          targetRole={targetRole}
          permissions={permissions}
          setPermissions={setPermissions}
          roles={roles}
          onCloseThisPage={(val) => setTargetRole(val)}
        />
      )}
    </>
  );
};

export default Roles;
