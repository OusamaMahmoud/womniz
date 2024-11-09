import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthProvider";

const Layout = () => {
  const { auth } = useAuth();
  return (
    <div className="flex relative">
      <div className={" min-h-screen ltr:md:ml-72 rtl:md:mr-72 w-full "}>
        <div className="static w-full mt-8">
          <Navbar />
        </div>
        <div className="m-4 ">
          <Outlet />
        </div>
      </div>
      {auth ? (
        <div className="w-72 fixed bg-white z-[1000]  ">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0">
          <Sidebar />
        </div>
      )}
    </div>
  );
};

export default Layout;
