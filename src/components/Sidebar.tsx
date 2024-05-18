import { Link, NavLink } from "react-router-dom";
import { links } from "../data/dummy";
import { useState } from "react";
import dashboard from "../assets/sidebar/dashboard.svg";
import home from "../assets/sidebar/home.svg";
import logo from "../assets/logo.svg";
import { useStateContext } from "../contexts/ContextProvider";
import {
  country,
  coupons,
  logout,
  permissions,
  products,
  reports,
  settings,
  termsConditions,
} from "../assets/sidebar";
import { MdOutlineCancel } from "react-icons/md";
const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // State to track active div
  const { activeMenu, screenSize, setActiveMenu } = useStateContext();
  const handleAccordionClick = (index: number) => {
    setActiveIndex(index); // Set the clicked div as active
  };

  const handleCloseSideBar = () => {
    if (
      activeMenu !== undefined &&
      screenSize !== undefined &&
      screenSize <= 900
    ) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-5 pl-2 pt-3 pb-2.5 rounded-2xl hover:bg-[#BED3C4] hover:text-[#577656] text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-2 pt-3 pb-2.5 rounded-2xl text-md m-2  hover:bg-[#BED3C4] hover:text-[#577656]";

  return (
    <div
      className=" h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 mt-14 sm:mt-2 rounded-e-[30px] "
      style={{ boxShadow: "rgb(26 39 39 / 17%) 12px -9px 11px -4px" }}
    >
      {activeMenu && (
        <>
          <div className="flex justify-between md:justify-center items-center">
            <Link to="/" onClick={handleCloseSideBar} className="mt-4">
              <img src={logo} alt="logo" />
            </Link>
            <div className="tooltip tooltip-bottom" data-tip={"Close"}>
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </div>
          </div>
          <div className="mt-10  mx-2">
            <NavLink
              onClick={handleCloseSideBar}
              to={`/dashboard`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={dashboard} alt="dashboard" />
              <span className="capitalize ">Dashboard</span>
            </NavLink>
            <NavLink
              to={`/`}
              onClick={handleCloseSideBar}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={home} alt="home" />
              <span className="capitalize ">Home</span>
            </NavLink>

            {links.map((item, idx) => (
              <div key={item.title} className="">
                <div className="collapse collapse-arrow ">
                  <input
                    type="radio"
                    name="my-accordion-2"
                    onClick={() => handleAccordionClick(idx)}
                  />
                  <div
                    className={`flex items-center text-lg gap-3 ${
                      activeIndex === idx
                        ? "text-white bg-[#577656] font-medium"
                        : ""
                    } collapse-title  capitalize `}
                  >
                    {item.icon}
                    {item.title}
                  </div>
                  <div className="collapse-content">
                    {item.links.map((link) => (
                      <NavLink
                        to={`/accounts/${link.name}`}
                        key={link.name}
                        onClick={handleCloseSideBar}
                        className={({ isActive }) =>
                          isActive ? activeLink : normalLink
                        }
                      >
                        <span className="capitalize ">{link.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <NavLink
              onClick={handleCloseSideBar}
              to={`/`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={coupons} alt="home" />
              <span className="capitalize ">Coupons & Vouchers</span>
            </NavLink>
            <NavLink
              onClick={handleCloseSideBar}
              to={`/`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={permissions} alt="home" />
              <span className="capitalize ">Permissions</span>
            </NavLink>
            <NavLink
              onClick={handleCloseSideBar}
              to={`/`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={termsConditions} alt="home" />
              <span className="capitalize ">Terms and Conditions</span>
            </NavLink>
            <NavLink
              onClick={handleCloseSideBar}
              to={`/`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={country} alt="home" />
              <span className="capitalize ">Country</span>
            </NavLink>
            <NavLink
              onClick={handleCloseSideBar}
              to={`/`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={reports} alt="home" />
              <span className="capitalize ">Reports</span>
            </NavLink>
            <NavLink
              onClick={handleCloseSideBar}
              to={`/`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={settings} alt="home" />
              <span className="capitalize ">Settings</span>
            </NavLink>
            <div className="flex items-center gap-5 pl-2 pt-3 pb-2.5 rounded-2xl text-md m-2  hover:bg-[#BED3C4] hover:text-[#577656]">
              <img src={logout} alt="home" />
              <span>Logout</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
