import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";
import apiClient from "../../../../services/api-client"; // Assuming this is a custom axios instance

interface MyRolePayload {
  id: number; // Fixed properties
  name: string;
  [key: `permissions[${number}]`]: string;
  _method: "post";
}

// type MyRolePayload = MyRoleBase & {
//   [key: `permissions[${number}]`]: string; // Allow dynamic keys like `permissions[1]`
// };

const AdminsUi = () => {
  const { data: roles } = useQuery<MyRolePayload[], Error>({
    queryKey: ["roles"],
    queryFn: () => apiClient.get("/roles").then((res) => res.data.data.data),
  });
  const queryClient = useQueryClient();

  const addRole = useMutation<MyRolePayload, Error, MyRolePayload>({
    mutationFn: (admin: MyRolePayload) => {
      // Create FormData to simulate the form-like submission
      const formData = new FormData();
      formData.append("name", admin.name);
      formData.append(`permissions[1]`, admin["permissions[1]"]);
      formData.append("_method", admin._method);

      // Sending the request using axios with FormData
      return apiClient
        .post("https://admin.womniz.com/api/v1/dashboard/roles", formData, {
          headers: {
            Accept: "application/json", // Accept header
          },
        })
        .then((res) => res.data);
    },
    onSuccess: (responseObj, requestObj) => {
      console.log("Request Object:", requestObj);
      console.log("Response Object:", responseObj);

      // invalidate the cache
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });

  const roleName = useRef<HTMLInputElement>(null);
  const rolePer = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      roleName.current &&
      roleName.current.value &&
      rolePer.current &&
      rolePer.current.value
    ) {
      const payload: MyRolePayload = {
        id: 0,
        name: roleName.current.value,
        [`permissions[1]`]: rolePer.current.value, // Dynamic key for permissions
        _method: "post",
      };

      addRole.mutate(payload);
    }
  };

  return (
    <div>
      {addRole.error && <p>{addRole.error.message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
        <input
          type="text"
          ref={roleName}
          placeholder="Role Name"
          className="input input-bordered"
        />
        <input
          type="text"
          ref={rolePer}
          placeholder="Permission"
          className="input input-bordered"
        />
        <button className="btn btn-accent" type="submit">
          Submit
        </button>
      </form>

      <div className="flex flex-col gap-3 mt-4">
        {roles?.map((role) => (
          <p key={role.id}>{role.name}</p>
        ))}
      </div>
    </div>
  );
};

export default AdminsUi;
