import SalonDetailsBranches from "../components/one-time/salonDetailsComponents/SalonDetailsBranches";
import SalonDetailsNavbar from "../components/one-time/salonDetailsComponents/SalonDetailsNavbar";
import SalonDetailsPersonalInformation from "../components/one-time/salonDetailsComponents/SalonDetailsPersonalInformation";
import SalonDetailsProfessionals from "../components/one-time/salonDetailsComponents/SalonDetailsProfessionals";
import SalonDetailsService from "../components/one-time/salonDetailsComponents/SalonDetailsService";

const SalonDetails = () => {
  return (
    <div>
      <SalonDetailsNavbar />
      <SalonDetailsPersonalInformation />
      <SalonDetailsService />
      <SalonDetailsBranches />
      <SalonDetailsProfessionals />
    </div>
  );
};

export default SalonDetails;
