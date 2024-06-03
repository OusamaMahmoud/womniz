import React from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequiredAuth = ({ allowRoles: allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  auth.roles?.find((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : auth ? (
    <Navigate to={"/unauthorized"} state={{ from: location }} replace />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};

export default RequiredAuth;
