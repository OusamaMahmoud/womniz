import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import { useAuth } from "../contexts/AuthProvider";
import apiClient from "../services/api-client";
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
import { RiAccountCircleLine } from "react-icons/ri";
import { BoxIcon } from "lucide-react";
import { PiCodesandboxLogoThin, PiHairDryer } from "react-icons/pi";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { setAuth, auth } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // State to track active div
  const { activeMenu, screenSize, setActiveMenu } = useStateContext();
  const { t } = useTranslation();

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
      await apiClient.post("/logout");
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

  const links = [
    {
      title: t("sidebar:sidebar.accounts.label"),
      icon: <RiAccountCircleLine />,
    },

    {
      title: t("sidebar:sidebar.products.label"),
      icon: <IoBagRemoveOutline />,
    },
    {
      title: t("sidebar:sidebar.orders.label"),
      icon: <BoxIcon className="w-5" />,
    },
    {
      title: t("sidebar:sidebar.salons.label"),
      icon: <PiHairDryer />,
    },
    {
      title: t("sidebar:sidebar.games.label"),
      icon: <PiCodesandboxLogoThin />,
    },
  ];

  const productsLinks = {
    links: [
      {
        name: t("sidebar:sidebar.products.all"),
        link: "/products",
      },
      {
        name: t("sidebar:sidebar.products.newProduct"),
        link: "/products/new-product",
      },
      {
        name: t("sidebar:sidebar.products.categories"),
        link: "/products/categories",
      },
      {
        name: t("sidebar:sidebar.products.brands"),
        link: "/products/brands",
      },
    ],
  };
  // const productsLinks = {
  //   links: [
  //     {
  //       name: "All",
  //       link: "/products",
  //     },
  //     {
  //       name: "Clothes",
  //       link: "/products/clothes",
  //     },
  //     {
  //       name: "Jewellery",
  //       link: "/products/jewellery",
  //     },
  //     {
  //       name: "Cosmetics",
  //       link: "/products/cosmetics",
  //     },
  //     {
  //       name: "Celebrities",
  //       link: "/products/celebrities",
  //     },
  //   ],
  // };
  const ordersLinks = {
    links: [
      {
        name: t("sidebar:sidebar.orders.label"),
        link: "/orders",
      },
      {
        name: t("sidebar:sidebar.orders.delivered"),
        link: "/orders/delivered",
      },
      {
        name: t("sidebar:sidebar.orders.failed"),
        link: "/orders/delivery_failed",
      },
      {
        name: t("sidebar:sidebar.orders.canceled"),
        link: "/orders/canceled",
      },
      {
        name: t("sidebar:sidebar.orders.returned"),
        link: "/orders/returned",
      },
    ],
  };
  const salonsLinks = {
    links: [
      {
        name: t("sidebar:sidebar.salons.salonsProfiles"),
        link: "/salons",
      },
      {
        name: t("sidebar:sidebar.salons.professionals"),
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
      className="min-h-screen overflow-y-auto max-h-screen pb-10 sm:mt-2 rounded-e-[30px]"
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
              <span className="capitalize ">
                {t("sidebar:sidebar.dashboard")}
              </span>
            </NavLink>
            <NavLink
              to={`/`}
              onClick={handleCloseSideBar}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={home} alt="home" />
              <span className="capitalize ">{t("sidebar:sidebar.home")}</span>
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

                  {item.title === t("sidebar:sidebar.accounts.label") && (
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
                          <span className="capitalize ">
                            {t("sidebar:sidebar.accounts.admins")}
                          </span>
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
                          <p className="capitalize">
                            {t("sidebar:sidebar.accounts.customers")}
                          </p>
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
                            {t("sidebar:sidebar.accounts.restoreAccounts")}
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
                          <span className="capitalize ">
                            {t("sidebar:sidebar.accounts.vendors")}
                          </span>
                        </NavLink>
                      )}
                    </div>
                  )}
                  {item.title === t("sidebar:sidebar.products.label") && (
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
                  {item.title === t("sidebar:sidebar.orders.label") && (
                    <div className="collapse-content">
                      {ordersLinks.links.map((order, idx) => (
                        <NavLink
                          key={idx}
                          to={`${order.link}`}
                          onClick={handleCloseSideBar}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          <span className="capitalize ">{order.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                  {item.title === t("sidebar:sidebar.salons.label") && (
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
                  {item.title === t("sidebar:sidebar.games.label") && (
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
                          <span className="capitalize ">
                            {t("sidebar:sidebar.games.scratchCoupon")}
                          </span>
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
                          <span className="capitalize ">
                            {t("sidebar:sidebar.games.spinTheWheel")}
                          </span>
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
              <span className="capitalize ">{t("sidebar:sidebar.coupons")}</span>
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
                <span className="capitalize ">{t("sidebar:sidebar.roles")}</span>
              </NavLink>
            )}
            <NavLink
              onClick={handleCloseSideBar}
              to={`/`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={termsConditions} alt="home" />
              <span className="capitalize ">{t("sidebar:sidebar.terms")}</span>
            </NavLink>
            <NavLink
              onClick={handleCloseSideBar}
              to={`/`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={country} alt="home" />
              <span className="capitalize ">{t("sidebar:sidebar.country")}</span>
            </NavLink>
            <NavLink
              onClick={handleCloseSideBar}
              to={`/`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={reports} alt="home" />
              <span className="capitalize ">{t("sidebar:sidebar.reports")}</span>
            </NavLink>
            <NavLink
              onClick={handleCloseSideBar}
              to={`/`}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <img src={settings} alt="home" />
              <span className="capitalize ">{t("sidebar:sidebar.settings")}</span>
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
                <span>{t("sidebar:sidebar.logout")}</span>
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
