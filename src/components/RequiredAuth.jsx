import React from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequiredAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.permissions?.find((perm) => {
    console.log("Fix =>", allowedRoles?.includes(perm));
    return allowedRoles?.includes(perm);
  }) ? (
    <Outlet />
  ) : auth ? (
    <Navigate to={"/unauthorized"} state={{ from: location }} replace />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};

export default RequiredAuth;
