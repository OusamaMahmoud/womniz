import { useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useAuth } from "../contexts/AuthProvider";
interface NavButtonProps {
  title: string;
  customFunc: () => void;
  icon: React.ReactElement;
  color?: string;
  dotColor?: string;
}
const NavButton = ({
  title,
  customFunc,
  icon,
  color,
  dotColor,
}: NavButtonProps) => (
  <div className="tooltip tooltip-bottom" data-tip={title}>
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </div>
);

const Navbar = () => {
  const { activeMenu, setActiveMenu, handleClick, setScreenSize, screenSize } =
    useStateContext();

  const { auth } = useAuth();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (auth === null) {
      setActiveMenu(false);
    } else if (screenSize !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, auth]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative ">
      <div className="w-20">
        {auth !== null && (
          <NavButton
            title="Menu"
            customFunc={handleActiveMenu}
            color={"black"}
            icon={<AiOutlineMenu />}
          />
        )}
      </div>
      <div className="flex">
        <NavButton
          title="Notification"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick("notification")}
          color={"black"}
          icon={<RiNotification3Line />}
        />
        <div className="tooltip tooltip-bottom" data-tip="Profile">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick("userProfile")}
          >
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
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </div>

        {/* {isClicked.cart && (<Cart />)}
      {isClicked.chat && (<Chat />)}
      {isClicked.notification && (<Notification />)}
      {isClicked.userProfile && (<UserProfile />)} */}
      </div>
    </div>
  );
};

export default Navbar;
