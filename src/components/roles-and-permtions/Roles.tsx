import React, { useState } from "react";
import { BiExport, BiPlus } from "react-icons/bi";
import RoleTable from "./RoleTable";
import usePermissions from "../../hooks/usePremissions";
import { FieldValues, useForm } from "react-hook-form";

const Roles: React.FC = () => {
  const { permissions, setPermissions } = usePermissions();
  const [isCreatingRolePageShow, setCreatingRolePageShow] = useState(false);
  const [selectAll, setSelectAll] = useState(true);

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
    console.log("DATA:", data);
    console.log("Selected Permissions:", selectedPermissions);
    const formData = new FormData();
    selectedPermissions.map((per, idx) => {
      formData.append(`permissions[${idx}]`, per);
      console.log(`permissions[${idx}]`, per);
    });
    // Send `selectedPermissions` to the API
  };
  return (
    <div className="container mx-auto px-6">
      {!isCreatingRolePageShow && (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Roles</h1>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setCreatingRolePageShow(true)}
                className="btn btn-outline flex gap-1"
              >
                <BiPlus /> Add Role
              </button>
              <button className="btn btn-outline flex gap-1">
                <BiExport /> Export
              </button>
            </div>
          </div>
          <label className="input input-bordered flex items-center gap-2 mt-4 w-fit">
            <input type="text" className="grow" placeholder="Search" />
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
            <RoleTable />
          </div>
        </div>
      )}
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
                  {category.permissions.map((permission, permissionIndex) => (
                    <label
                      key={permission.name}
                      className="cursor-pointer label w-full sm:w-auto"
                    >
                      <input
                        type="checkbox"
                        checked={permission.checked}
                        onChange={() =>
                          handleCheckboxChange(categoryIndex, permissionIndex)
                        }
                        className="checkbox checkbox-success"
                      />
                      <span className="label-text text-lg ml-4">
                        {permission.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-outline  text-lg mt-6 mr-4">Cancel</button>
          <button
            className="btn bg-[#577656] text-white font-medium text-lg mt-6"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Roles;
