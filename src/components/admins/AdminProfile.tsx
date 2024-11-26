import { useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Admin } from "../../services/admins-service";
import apiClient from "../../services/api-client";
import EditAdminForm from "./EditAdminForm";
import { showToast } from "../reuse-components/ShowToast";

const AdminProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [adminUpdated, setAdminUpdated] = useState<boolean>(false);
  const [, setPhotoPreview] = useState<string | null | undefined>(null);

  const params = useParams();
  const navigate = useNavigate();
  const [targetAdmin, setTargetAdmin] = useState<Admin>({} as Admin);
  const [targetAdminError, setTaretAdminError] = useState<string>("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    apiClient
      .get<{ data: Admin }>(`/admins/${params.id}`)
      .then((res) => {
        setTargetAdmin(res.data.data);
        setPhotoPreview(res.data.data.image);
      })
      .catch((err) => setTaretAdminError(err.message));
  }, [adminUpdated]);

  // HANDLE STATUS CHANGE
  const [status, setStatus] = useState<string>("0");

  useEffect(() => {
    setStatus(targetAdmin?.status);
  }, [targetAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    const newStatus = parseInt(e.target.value);
    try {
      apiClient.post(`/admins/${targetAdmin.id}/switchstatus`, {
        status: newStatus,
      });
    } catch (err: any) {}
  };

  const handleEditButton = () => {
    openModal();
  };

  // DELETE ADMIN.
  const handleConfirmationDelete = () => {
    (
      document.getElementById("deletion-modal") as HTMLDialogElement
    ).showModal();
  };

  const handleDeleteButton = () => {
    const data = new FormData();
    if (params && params.id) {
      data.append(`ids[1]`, params.id.toString());
    }
    apiClient
      .post("/admins/delete", data)
      .then(() => {
        showToast("Admins deleted successfully", "success");
        navigate("/accounts/Admins");
        (
          document.getElementById("deletion-modal") as HTMLDialogElement
        ).close();
      })
      .catch(() => {
        showToast("Failed to delete admin", "error");
        (
          document.getElementById("deletion-modal") as HTMLDialogElement
        ).close();
      });
  };

  return (
    <>
      {/* MODAL OF UPDATE ADMIN. */}
      <ToastContainer />

      {isModalOpen && (
        <EditAdminForm
          onModalOpen={(modelState) => setIsModalOpen(modelState)}
          handleUpdatedAdmin={() => {
            setAdminUpdated((prev) => !prev);
            showToast("Admin Updated successfully!", "success");
          }}
        />
      )}

      <dialog
        id="deletion-modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">Do you really want to delete this Account?</p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() =>
                (
                  document.getElementById("deletion-modal") as HTMLDialogElement
                ).close()
              }
            >
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDeleteButton}>
              Confirm
            </button>
          </div>
        </div>
      </dialog>

      {targetAdminError && (
        <p className="text-lg p-2 text-red-600">{targetAdminError}</p>
      )}

      {/* NAVBAR */}
      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center shadow-xl p-8">
          <div className="flex gap-3 items-start">
            <div className="w-20 h-20">
              {targetAdmin && targetAdmin.image && (
                <img
                  src={targetAdmin.image}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-full"
                />
              )}
            </div>
            <div className="ml-2">
              <p className="text-xl font-bold capitalize ">
                {targetAdmin.name}
              </p>
              <p className="capitalize">{targetAdmin.category}</p>
              <p className="capitalize">{targetAdmin.country}</p>
            </div>
            <select
              className={`select select-bordered ml-4 ${
                status == "1" ? "bg-[#ECFDF3]" : "bg-[#FDECEC]"
              }`}
              value={status}
              onChange={handleChange}
            >
              <option value={"1"}>Active</option>
              <option value={"0"}>Inactive</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleConfirmationDelete}
              className="flex items-center gap-2 text-[red] border border-[#d6cccc] rounded-md p-2"
            >
              <BiTrash className="text-xl" />
              Delete
            </button>
            <button
              onClick={handleEditButton}
              className="flex items-center gap-2  border border-[#d6cccc] rounded-md py-2 px-[18px]"
            >
              <BiEdit className="text-xl" /> Edit
            </button>
          </div>
        </div>
        {/* PUT ADMIN INFORMATION */}

        <div className="mt-20 p-10  rounded-lg shadow-xl">
          <h1 className="font-bold text-xl">Personal Information</h1>
          <div className="flex justify-between max-w-xs mt-5">
            <div className="flex flex-col gap-1">
              <span className="font-bold">Name</span>
              <span>{targetAdmin.name}</span>
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <span className="font-bold">Date of Birth</span>
              <span className="text-[gray]">{targetAdmin.birthdate}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <span className="font-bold">Email</span>
            <span className="text-[gray]">{targetAdmin.email}</span>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <span className="font-bold">Phone Number</span>
            <span className="text-[gray]">{targetAdmin.phone}</span>
          </div>
          <div className="flex flex-col gap-1 mt-5">
            <span className="font-bold">Bio</span>
            <span className="text-[gray]">{targetAdmin.category}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
