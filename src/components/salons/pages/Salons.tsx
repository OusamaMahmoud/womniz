import { RiFileSettingsFill } from "react-icons/ri";
import SalonHeader from "../components/reuseable/SalonHeader";

const Salons = () => {
  return (
    <SalonHeader title="Dashboard" subtitle="Welcome to your admin panel">
      <button className="btn btn-secondary">New Project</button>
      <button className="btn btn-secondary flex items-center space-x-1">
        <RiFileSettingsFill /> <span>Settings</span>
      </button>
    </SalonHeader>
  );
};

export default Salons;
