import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthProvider";

const Layout = () => {
  const { activeMenu, setActiveMenu } = useStateContext();
  return (
      <div className="flex relative">
        <div
          className={
            activeMenu
              ? " min-h-screen ltr:md:ml-72 rtl:md:mr-72 w-full   "
              : " w-full min-h-screen "
          }
        >
          <div className="static w-full mt-8">
            <Navbar />
          </div>
          <div className="m-4 ">
            <Outlet />
          </div>
        </div>
        {activeMenu ? (
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
