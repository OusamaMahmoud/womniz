import { HtmlHTMLAttributes } from "react";
import SalonDetailsNavbar from "../components/one-time/salonDetailsComponents/SalonDetailsNavbar";
import SalonDetailsPersonalInformation from "../components/one-time/salonDetailsComponents/SalonDetailsPersonalInformation";
import SalonFeatures from "../components/shared/SalonFeatures";
import SalonServiceForm from "../components/one-time/salonDetailsComponents/features/SalonServiceForm";
import SalonBranchesForm from "../components/one-time/salonDetailsComponents/features/SalonBranchesForm";
import SalonProfessionalsForm from "../components/one-time/salonDetailsComponents/features/SalonProfessionalsForm";

const SalonDetails = () => {
  const handleOpenModel = (id: string) => {
    const dialogModel = document.getElementById(id) as HTMLDialogElement;
    if (dialogModel) {
      dialogModel.showModal();
    }
  };
  const salonFeatureComponents = [
    { id: "service_modal", header: "Service" },
    { id: "branches_modal", header: "Branch" },
    { id: "professionals_modal", header: "Professional" },
  ];
  return (
    <div className="px-10">
      <SalonDetailsNavbar />
      <div className="px-8">
        <SalonDetailsPersonalInformation />
        {salonFeatureComponents.map((item) => (
          <SalonFeatures
            key={item.id}
            featureHeader={item.header}
            handleOpenDialogModel={() => handleOpenModel(item.id)}
          />
        ))}
      </div>
      {salonFeatureComponents.map((item) => (
        <Dialog key={item.id} dialogID={item.id} />
      ))}
    </div>
  );
};

export default SalonDetails;

export const Dialog = ({ dialogID }: { dialogID: string }) => {
  const onCloseModel = (id: string) => {
    const dialogModel = document.getElementById(id) as HTMLDialogElement;
    if (dialogModel) {
      dialogModel.close();
    }
  };

  return (
<dialog id={dialogID} className="modal">
  <div className="modal-box w-full max-w-4xl p-8">
    {dialogID == "service_modal" && (
      <SalonServiceForm onClose={() => onCloseModel(dialogID)} />
    )}
    {dialogID == "branches_modal" && (
      <SalonBranchesForm onClose={() => onCloseModel(dialogID)} />
    )}
    {dialogID == "professionals_modal" && (
      <SalonProfessionalsForm onClose={() => onCloseModel(dialogID)} />
    )}
  </div>
</dialog>

  );
};
