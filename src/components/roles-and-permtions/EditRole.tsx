import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Role } from "../../services/role-service";
import { PermissionCategory } from "../../services/permission-service";
import apiClient from "../../services/api-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const EditRole = ({
  targetRole,
  permissions,
  setPermissions,
  roles,
  onCloseThisPage,
}: {
  targetRole: Role;
  permissions: PermissionCategory[];
  setPermissions: any;
  roles: Role[];
  onCloseThisPage: (value: null) => void;
}) => {
  const { handleSubmit, register } = useForm();
  //   const { permissions, setPermissions } = usePermissions();
  //   const { roles } = useRoles();

  // Update permissions whenever targetRole or roles change
  useEffect(() => {
    const roleWithPermissions = roles.find(
      (role) => role.name === targetRole.name
    );

    if (roleWithPermissions) {
      const targetRolePermissions = roleWithPermissions.permissions.map(
        (_) => _.name
      );

      const updatedPermissions = permissions.map((per) => {
        return {
          ...per,
          permissions: per.permissions.map((item) => ({
            ...item,
            checked: targetRolePermissions.includes(item.name),
          })),
        };
      });

      setPermissions(updatedPermissions);
    }
  }, [targetRole, roles, setPermissions]);

  const [selectAll, setSelectAll] = useState(false);

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

  const onSubmit = (data: FieldValues) => {
    const selectedPermissions = permissions.flatMap((category) =>
      category.permissions
        .filter((permission) => permission.checked)
        .map((permission) => permission.name)
    );
    const formData = new FormData();
    formData.append("name", data.ro);
    formData.append("_method", "put");

    selectedPermissions.map((per, idx) => {
      formData.append(`permissions[${idx}]`, per);
    });
    try {
      apiClient.post(`/roles/${targetRole.id}`, formData);
      toast.success(`${data.ro} Role is Successfully Edited.`);
      onCloseThisPage(null);
    } catch (error) {}
  };

  return (
    <div className="container mx-auto px-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-4xl font-semibold">Edit Role</h1>
        <div className="flex items-center justify-between ">
          <div className="mt-8">
            <p className="text-2xl font-bold  mb-2">Role Name</p>
            <input
              {...register("ro")}
              id="ro"
              type="text"
              defaultValue={targetRole.name}
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
                <h1 className="text-2xl font-semibold ">{category.grouping}</h1>
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
        <div className="flex gap-6 items-center mt-8">
          <button
            onClick={() => onCloseThisPage(null)}
            type="button"
            className="btn px-10"
          >
            Cancel
          </button>
          <button className="btn  px-10 bg-[#577656] text-white text-lg hover:bg-[#7ca77a]">
            Edit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRole;
