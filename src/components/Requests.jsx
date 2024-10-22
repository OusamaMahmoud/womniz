import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go"; // Assuming you're using react-icons for icons
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import useRequests from "../hooks/useRequests";
import apiClient from "../services/api-client";
import RequestDateCalender from "./RequestDateCalender";
import { ToastContainer, toast } from "react-toastify";
import { TableSkeleton } from "./reuse-components/TableSkeleton";
import { useTranslation } from "react-i18next";

const Requests = () => {
  const [dateValue, setDateValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [rowId, setRowId] = useState("");

  const [sortBy, setSortBy] = useState(null);
  const [sortDesc, setSortDesc] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectedRequestLoading, setRejectedRequestLoading] = useState(false);
  const [isRequestAcceptLoading, setRequestAcceptLoading] = useState(false);

  const { requests, setRequests, isLoading } = useRequests({
    date: dateValue,
    search: searchValue,
  });

  const handleSort = (key) => {
    if (key === sortBy) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key);
      setSortDesc(false);
    }
  };

  const sortedData = requests.sort((a, b) => {
    if (sortBy) {
      const aValue = a[sortBy].toString().toLowerCase();
      const bValue = b[sortBy].toString().toLowerCase();
      if (aValue < bValue) return sortDesc ? 1 : -1;
      if (aValue > bValue) return sortDesc ? -1 : 1;
    }
    return 0;
  });

  const handleRequestAccept = async (id) => {
    try {
      setRequestAcceptLoading(true);
      const res = await apiClient.post(
        `/restoreAccountRequest/changeStatus/${id}`,
        {
          status: "1",
        }
      );
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "accepted" } : request
        )
      );
      setRequestAcceptLoading(false);
      toast.success("Request is be Accepted.");
    } catch (error) {
      setRequestAcceptLoading(false);
      toast.error("There is something go Wrong!!.");
    }
  };

  const handleRequestReject = async () => {
    try {
      setRejectedRequestLoading(true);
      const res = await apiClient.post(
        `/restoreAccountRequest/changeStatus/${rowId}`,
        {
          status: "0",
          rejection_reason: rejectReason,
        }
      );
      setRequests((prev) =>
        prev.map((request) =>
          request.id === rowId ? { ...request, status: "rejected" } : request
        )
      );
      setRejectedRequestLoading(false);
      document.getElementById("my_modal_4").close();
      toast.success("Request is be Rejected.");
    } catch (error) {
      setRejectedRequestLoading(false);
      toast.error("There is something go Wrong!!.");
    }
  };

const {t} =useTranslation()

  if (isLoading) return <TableSkeleton noOfElements={5} />;
  return (
    <div className="container mx-auto px-10">
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <textarea
            onChange={(e) => setRejectReason(e.currentTarget.value)}
            placeholder="Write the reasons for rejection"
            className="w-[400px] h-[100px] lg:w-[800px] lg:h-[150px] mb-4 border p-4"
          ></textarea>
          <div className="modal-action">
            <form method="dialog">
              <div
                onClick={handleRequestReject}
                className="btn px-10 bg-[#577656] text-white"
              >
                {isRejectedRequestLoading ? t('common:actions.submitting') : t('common:actions.submit')}
              </div>
              <button className="btn px-10 mr-4">{t('common:actions.close')}</button>
            </form>
          </div>
        </div>
      </dialog>
      <ToastContainer />
      <div className="flex items-center gap-2 mb-4">
        <div className="form-control">
          <label className="input input-bordered  flex items-center gap-2 max-w-72">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder={t('common:placeholders.search')}
              className="grow"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </label>
        </div>
        <div className="form-control">
          <RequestDateCalender
            onSelectedDate={(selectedDate) => setDateValue(selectedDate)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal ">
              <SortableHeader
                label={t('requests:restoreAccounts.tableHeader.id')}
                onClick={() => handleSort("customerId")}
                sorted={sortBy == "customerId" ? !sortDesc : null}
              />
              <SortableHeader
                label={t('requests:restoreAccounts.tableHeader.name')}
                onClick={() => handleSort("name")}
                sorted={sortBy == "name" ? !sortDesc : null}
              />
              <SortableHeader
                label={t('requests:restoreAccounts.tableHeader.email')}
                onClick={() => handleSort("email")}
                sorted={sortBy == "email" ? !sortDesc : null}
              />
              <SortableHeader
                label={t('requests:restoreAccounts.tableHeader.date')}
                onClick={() => handleSort("date")}
                sorted={sortBy == "date" ? !sortDesc : null}
              />
              <SortableHeader
                label={t('requests:restoreAccounts.tableHeader.status')}
                onClick={() => handleSort("status")}
                sorted={sortBy == "status" ? !sortDesc : null}
              />
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {sortedData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{row.id}</td>
                <td className="py-3 px-6 text-left">{row.user.name}</td>
                <td className="py-3 px-6 text-left">{row.user.email}</td>
                <td className="py-3 px-6 text-left">{row.date}</td>
                <td className="flex py-3 px-6 text-left">
                  {row.status === "accepted" || row.status === "rejected" ? (
                    <p
                      className={` ${
                        row.status === "accepted"
                          ? "badge bg-green-400 mr-3 cursor-pointer"
                          : "badge cursor-pointer"
                      }`}
                    >
                      {row.status}
                    </p>
                  ) : (
                    <>
                      <p
                        onClick={() => handleRequestAccept(row.id)}
                        className="badge bg-green-400 mr-3 cursor-pointer"
                      >
                        {isRequestAcceptLoading ? "processing..." : "Accept"}
                      </p>
                      <p
                        onClick={() => {
                          document.getElementById("my_modal_4").showModal();
                          setRowId(row.id);
                        }}
                        className="badge cursor-pointer"
                      >
                        Reject
                      </p>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Requests;

const SortableHeader = ({ label, onClick, sorted }) => (
  <th className="py-3 px-6 text-left cursor-pointer" onClick={onClick}>
    {label}
    {sorted !== null && (
      <span className={`ml-2 ${sorted ? "text-green-600" : "text-red-600"}`}>
        {sorted ? "↑" : "↓"}
      </span>
    )}
  </th>
);
