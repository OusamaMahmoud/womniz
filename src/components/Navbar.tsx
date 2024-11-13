import {  useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useAuth } from "../contexts/AuthProvider";
import i18n from "../i18n/i18n";
// interface NavButtonProps {
//   title: string;
//   customFunc: () => void;
//   icon: React.ReactElement;
//   color?: string;
//   dotColor?: string;
// }
// const NavButton = ({
//   title,
//   customFunc,
//   icon,
//   color,
//   dotColor,
// }: NavButtonProps) => (
//   <div className="tooltip tooltip-bottom" data-tip={title}>
//     <button
//       type="button"
//       onClick={() => customFunc()}
//       style={{ color }}
//       className="relative text-xl rounded-full p-3 hover:bg-light-gray"
//     >
//       <span
//         style={{ background: dotColor }}
//         className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
//       />
//       {icon}
//     </button>
//   </div>
// );

const Navbar = () => {
  const { setLang } = useStateContext();

  const { auth } = useAuth();

  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem("womnizLang") ?? "en";
  });

  // Change language and save it to localStorage
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setSelectedLang(lang);
    localStorage.setItem("womnizLang", lang);
    setLang(lang);
  };

  return (
    <>
      {auth !== null && (
        <div className="flex justify-end  p-2 md:ml-6 md:mr-6 relative ">
          <div className="flex flex-col gap-3 ">
            {/* Language Switcher */}
            <div className="dropdown">
              <label
                tabIndex={0}
                className="btn btn-outline btn-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m-7.5-7.5h15"
                  />
                </svg>
                {selectedLang === "en" ? "English" : "العربية"}
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-50"
              >
                <li>
                  <button
                    className={`flex justify-between ${
                      selectedLang === "en" ? "bg-primary text-white" : ""
                    }`}
                    onClick={() => {
                      changeLanguage("en");
                    }}
                  >
                    English
                    {selectedLang === "en" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    className={`flex justify-between ${
                      selectedLang === "ar" ? "bg-primary text-white" : ""
                    }`}
                    onClick={() => changeLanguage("ar")}
                  >
                    العربية
                    {selectedLang === "ar" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              </ul>
            </div>

            <div className="flex">
              {/* <NavButton
              title="Notification"
              dotColor="rgb(254, 201, 15)"
              customFunc={() => handleClick("notification")}
              color={"black"}
              icon={<RiNotification3Line />}
            /> */}
              <div className="tooltip tooltip-bottom" data-tip="Profile">
                <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg">
                  <img
                    className="rounded-full w-8 h-8"
                    src={auth?.image}
                    alt="user-profile"
                  />
                  <p>
                    <span className="text-gray-400 text-14">Hi,</span>{" "}
                    <span className="text-gray-400 font-bold ml-1 text-14">
                      {auth?.name}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
