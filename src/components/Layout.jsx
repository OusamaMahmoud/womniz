import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthProvider";

const Layout = () => {
  const { activeMenu, setActiveMenu } = useStateContext();

  return (
    <div>
      <div className="flex relative">
        {activeMenu ? (
          <div className="w-72 fixed  bg-white z-[1000]  ">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0">
            <Sidebar />
          </div>
        )}
        <div
          className={
            activeMenu
              ? " min-h-screen md:ml-72 w-full   "
              : " w-full min-h-screen flex-2 "
          }
        >
          <div className="static w-full mt-8">
            <Navbar />
          </div>
          <div className="m-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
