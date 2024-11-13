import React, { useState, useEffect } from "react";
import { BiExport, BiPlusCircle, BiTrash } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAdmins from "../../hooks/useAdmins";
import apiClient from "../../services/api-client";
import Pagination from "../Pagination";
import useAllAdmins from "../../hooks/useAllAdmins";
import AdminsResponsiveTable from "./AdminsResponsiveTable";
import { exportToExcel } from "../methods/exportToExcel";
import AdminForm from "./AdminForm";
import { TableSkeleton } from "../reuse-components/TableSkeleton";
import { StatusInput } from "../reuse-components/filteringInputs/StatusInput";
import { SearchInput } from "../reuse-components/filteringInputs/SearchInput";
import { useAuthGard } from "../reuse-hooks/AuthGard";
import { ActionButton } from "../reuse-components/ActionButtons";
import { HeadingOne } from "../reuse-components/HeadingOne";
import { useTranslation } from "react-i18next";

const Admins: React.FC = () => {
  // Handle Filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedAdmins, setSelectedAdmins] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationPage, setPaginationPage] = useState<string>("1");
  const [refreshAdminsList, setRefreshAdminsList] = useState(false);

  // const { mainCategories } = useMainCategories(refreshAdminsList);

  const {
    admins,
    meta,
    next,
    prev,
    isLoading,
    error: fetchAdminsError,
  } = useAdmins({
    categories: selectedCategory,
    status: selectedStatus,
    search: searchValue,
    isFetching: refreshAdminsList,
    page: paginationPage,
  });

  const recordsPerPage = meta.per_page || 5;
  const nPages = Math.ceil(admins.length / recordsPerPage);

  // Handle React Hook Form

  const handleRefreshAdminsList = () => {
    setRefreshAdminsList((prev) => !prev);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    setIsDeleteEnabled(selectedAdmins.size > 0);
  }, [selectedAdmins]);

  const handleCheckAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allAdminIds = admins.map((admin) => admin.id);
      setSelectedAdmins(new Set(allAdminIds));
    } else {
      setSelectedAdmins(new Set());
    }
  };

  const handleCheckboxChange = (id: number) => {
    const newSelectedAdmins = new Set(selectedAdmins);
    if (newSelectedAdmins.has(id)) {
      newSelectedAdmins.delete(id);
    } else {
      newSelectedAdmins.add(id);
    }
    setSelectedAdmins(newSelectedAdmins);
  };

  const handleDelete = async () => {
    if (selectedAdmins.size > 0) {
      const data = new FormData();
      Array.from(selectedAdmins).forEach((id, index) => {
        data.append(`ids[${index}]`, id.toString());
      });
      try {
        await apiClient.post("/admins/delete", data);
        toast.success("Admins deleted successfully");
        setRefreshAdminsList((prev) => !prev);
        setSelectAll(false);
        setIsDeleteEnabled(false);
        // Optionally, refetch the data or update the state to remove the deleted admins
      } catch (error) {
        toast.error("Failed to delete admins");
      }
    }
  };

  const { alladmins, isAllAdminsError } = useAllAdmins();

  const { t } = useTranslation();

  return (
    <div className="overflow-x-scroll p-5">
      <ToastContainer />
      {fetchAdminsError && <p>{fetchAdminsError}</p>}
      {/* ACTION BUTTONS */}
      <div className=" justify-between items-center lg:flex mb-5">
        {isAllAdminsError && (
          <p className="text-red-600 text-lg p-2">{isAllAdminsError}</p>
        )}
        <HeadingOne label={t("admins:admins.header")} marginBottom="2" />
        <div className="flex items-center flex-wrap gap-2">
          {useAuthGard({ key: "admin-create" }) && (
            <ActionButton
              className="btn bg-[#577656] text-[white] text-[10px] lg:text-lg"
              icon={<BiPlusCircle className="xl:text-xl" />}
              label={t("admins:admins.adminButtons.add")}
              method={openModal}
            />
          )}
          {useAuthGard({ key: "admin-delete" }) && (
            <ActionButton
              className={`btn btn-outline text-[#E20000B2] text-[10px] lg:text-lg ${
                !isDeleteEnabled && "cursor-not-allowed"
              }`}
              icon={<BiTrash className="xl:text-lg text-[#E20000B2]" />}
              label={t("admins:admins.adminButtons.delete")}
              method={handleDelete}
              isDisabled={!isDeleteEnabled}
            />
          )}

          {useAuthGard({ key: "admin-export" }) && (
            <ActionButton
              className="btn text-[10px] lg:text-lg btn-outline"
              icon={<BiExport />}
              label={t("admins:admins.adminButtons.export")}
              method={() =>
                exportToExcel({ products: alladmins, label: "Admins" })
              }
            />
          )}
        </div>
      </div>
      {/* Handle Filters */}
      <div className="my-6 flex items-center flex-wrap gap-3">
        {/* Search Bar */}
        <SearchInput
          onSearchText={(text) => setSearchValue(text)}
          searchText={searchValue}
          placeHolder={t("admins:adminsPlaceholders.search")}
        />
        {/* Status Bar */}
        <StatusInput
          onSelectStatus={(status) => setSelectedStatus(status)}
          selectedStatus={selectedStatus}
          placeHolder={t("admins:adminsPlaceholders.status")}
        />
      </div>
      {/* Table */}
      {isLoading ? (
        <TableSkeleton noOfElements={6} />
      ) : (
        <>
          <AdminsResponsiveTable
            tableData={admins}
            handleCheckAll={handleCheckAll}
            selectAll={selectAll}
            handleCheckboxChange={handleCheckboxChange}
            selectedObjects={selectedAdmins}
          />
          <Pagination
            onPage={(pg: string) => setPaginationPage(pg)}
            itemsPerPage={recordsPerPage}
            nPages={nPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            next={next}
            prev={prev}
          />
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <AdminForm
          onRefresh={handleRefreshAdminsList}
          onModalOpen={(modalState) => setIsModalOpen(modalState)}
        />
      )}
    </div>
  );
};

export default Admins;
