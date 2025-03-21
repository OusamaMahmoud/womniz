import React, { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthProvider";
import { ToastContainer } from "react-toastify";
import LoadingModal from "../modals/LoadingModal";

const Layout = () => {
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState();
  const handleOpenSidebar = useCallback((isSideBarOpen) => {
    setIsOpen(isSideBarOpen);
  }, []);
  return (
    <div className="flex relative">
      <div
        className={` min-h-screen ${
          isOpen && "ltr:md:ml-72 rtl:md:mr-72"
        } w-full ltr:ml-16 rtl:mr-16 `}
      >
        <div className="static w-full mt-8">
          <Navbar />
        </div>
        <div className="m-4">
          <Outlet />
        </div>
      </div>
      {auth && (
        <div className="fixed bg-white z-[1000]  ">
          <Sidebar onSidebarToggle={handleOpenSidebar} />
        </div>
      )}
      <LoadingModal />
    </div>
  );
};

export default Layout;
