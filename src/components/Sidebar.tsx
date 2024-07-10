import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import { useAuth } from "../contexts/AuthProvider";
import apiClient from "../services/api-client";
import { links } from "../data/dummy";
import dashboard from "/assets/sidebar/dashboard.svg";
import home from "/assets/sidebar/home.svg";
import logo from "/assets/logo.svg";
import {
  country,
  coupons,
  logout,
  permissions,
  reports,
  settings,
  termsConditions,
} from "../../public/assets/sidebar";
import { IoBagRemoveOutline } from "react-icons/io5";

const Sidebar = () => {
  const { setAuth, auth } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
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

  const handleLogOutButton = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post("/logout");
      localStorage.removeItem("authToken"); // Adjust based on your storage method
      setAuth(null);

      navigate("/login");
      setLoading(false);
      (document.getElementById("logout_modal") as HTMLDialogElement).close();
    } catch (err: any) {
      if (!err?.response) {
        setError("No Server Response!");
      }
      setError(err.message);
      setLoading(false);
      // (document.getElementById("logout_modal") as HTMLDialogElement).close();
    }
  };

  const handleLogoutClick = () => {
    (document.getElementById("logout_modal") as HTMLDialogElement).showModal();
  };

  const productsLinks = {
    title: "Products",
    icon: <IoBagRemoveOutline />,
    links: [
      {
        name: "All",
        link: "/products/all-products",
      },
      {
        name: "Clothes",
        link: "/products/clothes",
      },
      {
        name: "Jewelry",
        link: "/products/jewelry",
      },
      {
        name: "Cosmetics",
        link: "/products/cosmetics",
      },
      {
        name: "Celebrities",
        link: "/products/celebrities",
      },
    ],
  };
  const salonsLinks = {
    title: "Salons",
    icon: <IoBagRemoveOutline />,
    links: [
      {
        name: "Salon’s Profiles",
        link: "/salons/salons-profiles",
      },
      {
        name: "Professionals",
        link: "/salons/professionals",
      },
    ],
  };
  const activeLink =
    "flex items-center gap-5 pl-2 pt-3 pb-2.5 rounded-2xl text-[#577656] hover:bg-[#BED3C4] hover:text-[#577656] text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-2 pt-3 pb-2.5 rounded-2xl text-md m-2  hover:bg-[#BED3C4] hover:text-[#577656]";

  return (
    <div
      className=" min-h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10  sm:mt-2 rounded-e-[30px] "
      style={{ boxShadow: "rgb(26 39 39 / 17%) 12px -9px 11px -4px" }}
    >
      {activeMenu && (
        <>
          <div className="flex justify-between md:justify-center items-center">
            <Link to="/" onClick={handleCloseSideBar} className="mt-6">
              <img src={logo} alt="logo" className="object-cover md:w-36" />
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
          <div className="mt-10 mx-2">
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
                        ? "text-[white] bg-[#577656] font-medium"
                        : ""
                    } collapse-title  capitalize `}
                  >
                    {item.icon}
                    {item.title}
                  </div>
                  {item.title === "Accounts" && (
                    <div className="collapse-content">
                      {auth?.permissions.find(
                        (per) => per === "admin-list"
                      ) && (
                        <NavLink
                          to={`/accounts/admins`}
                          onClick={handleCloseSideBar}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          <span className="capitalize ">Admins</span>
                        </NavLink>
                      )}

                      {auth?.permissions.find((per) => per === "user-list") && (
                        <NavLink
                          to={`/accounts/customers`}
                          onClick={handleCloseSideBar}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          <p className="capitalize">Customers</p>
                        </NavLink>
                      )}

                      {auth?.permissions.find((per) => per === "user-list") && (
                        <NavLink
                          to={`/accounts/requests`}
                          onClick={handleCloseSideBar}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          <p className="ml-2 -mt-5 pt-4 flex items-center justify-center">
                            Restore Accounts
                          </p>
                        </NavLink>
                      )}

                      {auth?.permissions.find(
                        (per) => per === "vendor-list"
                      ) && (
                        <NavLink
                          to={`/accounts/vendors`}
                          onClick={handleCloseSideBar}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          <span className="capitalize ">Vendors</span>
                        </NavLink>
                      )}
                    </div>
                  )}
                  {item.title === "Products" && (
                    <div className="collapse-content">
                      {productsLinks.links.map((pro, idx) => (
                        <NavLink
                          key={idx}
                          to={`${pro.link}`}
                          onClick={handleCloseSideBar}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          <span className="capitalize ">{pro.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                  {item.title === "Salons" && (
                    <div className="collapse-content">
                      {salonsLinks.links.map((sa, idx) => (
                        <NavLink
                          key={idx}
                          to={`${sa.link}`}
                          onClick={handleCloseSideBar}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          <span className="capitalize ">{sa.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                  {item.title === "Games" && (
                    <div className="collapse-content">
                      {auth?.permissions.find(
                        (per) => per === "scratch-game-information"
                      ) && (
                        <NavLink
                          to={`/games/scratch`}
                          onClick={handleCloseSideBar}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          <span className="capitalize ">Scratch Coupon</span>
                        </NavLink>
                      )}

                      {auth?.permissions.find(
                        (per) => per === "spin-game-information"
                      ) && (
                        <NavLink
                          to={`/games/spin`}
                          onClick={handleCloseSideBar}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          <span className="capitalize ">Spin the Wheel</span>
                        </NavLink>
                      )}
                    </div>
                  )}
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
            {auth?.permissions.find((per) => per === "role-list") && (
              <NavLink
                onClick={handleCloseSideBar}
                to={`/roles-permissions`}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <img src={permissions} alt="home" />
                <span className="capitalize ">Roles & Permissions</span>
              </NavLink>
            )}
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
            <div
              onClick={handleLogoutClick}
              className={`flex items-center gap-5 pl-2 pt-3 pb-2.5 rounded-2xl
               text-md m-2 cursor-pointer hover:bg-[#BED3C4]
                hover:text-[#577656]
                `}
            >
              {!isLoading && <img src={logout} alt="home" />}
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <span>Logout</span>
              )}
            </div>
          </div>
        </>
      )}

      {/* Logout Confirmation Modal */}
      <dialog id="logout_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          {error && (
            <p className="bg-error p-2 rounded-md text-white mb-4">{error}</p>
          )}
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">Do you really want to log out?</p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                (
                  document.getElementById("logout_modal") as HTMLDialogElement
                ).close();
                setError("");
              }}
            >
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleLogOutButton}>
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Sidebar;
