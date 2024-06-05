import React, { useState } from "react";
import { BiExport, BiPlus } from "react-icons/bi";
import RoleTable from "./RoleTable";

interface Permission {
  label: string;
  checked: boolean;
}

interface Category {
  category: string;
  permissions: Permission[];
}

const initialPermissions: Category[] = [
  {
    category: "Dashboard Control",
    permissions: [{ label: "Dashboard", checked: true }],
  },
  {
    category: "Admin",
    permissions: [
      { label: "Admin-list", checked: true },
      { label: "Admin-create", checked: true },
      { label: "Admin-edit", checked: true },
      { label: "Admin-delete", checked: true },
      { label: "Admin-export", checked: true },
    ],
  },
  {
    category: "Item",
    permissions: [
      { label: "Item-list", checked: true },
      { label: "Item-create", checked: true },
      { label: "Item-edit", checked: true },
      { label: "Item-delete", checked: true },
      { label: "Item-export", checked: true },
    ],
  },
  {
    category: "Order",
    permissions: [
      { label: "Order-list", checked: true },
      { label: "Order-show", checked: true },
      { label: "Order-track", checked: true },
      { label: "Order-export", checked: true },
      { label: "Order-print-invoice", checked: true },
      { label: "Order-send-invoice", checked: true },
      { label: "Order-edit-status", checked: true },
    ],
  },
  {
    category: "Role",
    permissions: [
      { label: "Role-list", checked: true },
      { label: "Role-create", checked: true },
      { label: "Role-edit", checked: true },
      { label: "Role-delete", checked: true },
      { label: "Role-export", checked: true },
    ],
  },
  {
    category: "Item Type",
    permissions: [
      { label: "item-type-list", checked: true },
      { label: "item-type-create", checked: true },
      { label: "item-type-edit", checked: true },
      { label: "item-type-delete", checked: true },
      { label: "item-type-export", checked: true },
    ],
  },
  {
    category: "Item Tax",
    permissions: [
      { label: "item-tax-list", checked: true },
      { label: "item-tax-create", checked: true },
      { label: "item-tax-edit", checked: true },
      { label: "item-tax-delete", checked: true },
      { label: "item-tax-export", checked: true },
    ],
  },
  {
    category: "User",
    permissions: [
      { label: "user-list", checked: true },
      { label: "user-create", checked: true },
      { label: "user-edit", checked: true },
      { label: "user-delete", checked: true },
      { label: "user-export", checked: true },
    ],
  },
  {
    category: "Coupon",
    permissions: [
      { label: "coupon-list", checked: true },
      { label: "coupon-create", checked: true },
      { label: "coupon-edit", checked: true },
      { label: "coupon-delete", checked: true },
      { label: "coupon-export", checked: true },
    ],
  },
  {
    category: "Ticket",
    permissions: [
      { label: "ticket-list", checked: true },
      { label: "ticket-create", checked: true },
      { label: "ticket-edit", checked: true },
      { label: "ticket-delete", checked: true },
      { label: "ticket-export", checked: true },
    ],
  },
];

const Roles: React.FC = () => {
  const [isCreatingRolePageShow, setCreatingRolePageShow] = useState(false);
  const [permissions, setPermissions] =
    useState<Category[]>(initialPermissions);
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

  const handleSubmit = () => {
    const selectedPermissions = permissions.flatMap((category) =>
      category.permissions
        .filter((permission) => permission.checked)
        .map((permission) => permission.label)
    );
    console.log("Selected Permissions:", selectedPermissions);
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
        <div>
          <h1 className="text-4xl font-semibold">Create Roles</h1>
          <div className="flex items-center justify-between ">
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
                key={category.category}
                className="border rounded-md p-4 shadow-lg mt-6"
              >
                <div className="flex justify-between items-center ">
                  <h1 className="text-2xl font-semibold ">
                    {category.category}
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
                      key={permission.label}
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
                        {permission.label}
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
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Roles;
