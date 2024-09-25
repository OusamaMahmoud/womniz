import React, { useState, useEffect } from "react";
import { BiExport, BiPlusCircle, BiTrash } from "react-icons/bi";
import avatar from "/assets/admin/avatar.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import useAdmins from "../hooks/useAdmins";
import apiClient from "../services/api-client";
import adminService from "../services/admins-service";
import useCategories from "../hooks/useCategories";
import Select from "react-select";
import { customStyles } from "../components/CustomSelect";
import Pagination from "./Pagination";
import useAllAdmins from "../hooks/useAllAdmins";
import useRoles from "../hooks/useRoles";
import { useAuth } from "../contexts/AuthProvider";
import AdminsResponsiveTable from "./AdminsResponsiveTable";
import { exportToExcel } from "./methods/exportToExcel";
import AdminForm from "./admins/AdminForm";
import { TableSkeleton } from "./reuse-components/TableSkeleton";
import { StatusInput } from "./reuse-components/filteringInputs/StatusInput";
import { SelectCategoryInput } from "./reuse-components/filteringInputs/SelectCategoryInput";
import { SearchInput } from "./reuse-components/filteringInputs/SearchInput";
import { useAuthGard } from "./reuse-hooks/AuthGard";
import { ActionButton } from "./reuse-components/ActionButtons";
import { HeadingOne } from "./reuse-components/HeadingOne";

// ZOD SCHEMA
const schema = z.object({
  name: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z\s]*$/),
  email: z.string().email(),
  password: z.string().min(8).max(50),
  birthdate: z.string().date(),
  address: z.string().min(3).max(255),
  phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?\d+$/),
  jobs: z.array(z.string()).min(1),
  status: z.enum(["0", "1"]).default("0"),
  country_id: z.enum(["2", "1"]).default("2"),
  role: z.string().min(3, { message: "Role Must Be Selected!" }),
});

export type FormData = z.infer<typeof schema>;
export type OptionType = { label: string; value: string };
const Admins: React.FC = () => {
  const { auth } = useAuth();
  const { roles } = useRoles();

  // Handle Filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [selectedAdmins, setSelectedAdmins] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);

  const [creatingAdminError, setCreatingAdminError] = useState<string>("");
  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);

  const [imageFile, setImageFile] = useState<File>({} as File);
  const [isSubmittinLoading, setSubmitinLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationPage, setPaginationPage] = useState<string>("1");

  const { categories } = useCategories();
  const options: OptionType[] = categories.map((item) => ({
    label: item.title,
    value: item.title,
  }));

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
    isFetching: trigerFetch,
    page: paginationPage,
  });

  const recordsPerPage = meta.per_page || 5;
  const nPages = Math.ceil(admins.length / recordsPerPage);

  // Handle React Hook Form

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
        setTrigerFetch(!trigerFetch);
        setSelectAll(false);
        setIsDeleteEnabled(false);
        // Optionally, refetch the data or update the state to remove the deleted admins
      } catch (error) {
        toast.error("Failed to delete admins");
      }
    }
  };
  // Toastify
  const notify = () => toast.success("Create Admin Successfully!");

  const { alladmins, isAllAdminsError } = useAllAdmins();

  return (
    <div className="overflow-x-scroll p-5">
      <ToastContainer />
      {fetchAdminsError && <p>{fetchAdminsError}</p>}
      {/* ACTION BUTTONS */}
      <div className=" justify-between items-center lg:flex mb-5">
        {isAllAdminsError && (
          <p className="text-red-600 text-lg p-2">{isAllAdminsError}</p>
        )}
        <HeadingOne label="Admins Details" />
        <div className="flex items-center flex-wrap gap-2">
          {useAuthGard({ key: "admin-create" }) && (
            <ActionButton
              className="btn bg-[#577656] text-[white] text-[10px] lg:text-lg"
              icon={<BiPlusCircle className="xl:text-xl" />}
              label=" Add Admin Account"
              method={openModal}
            />
          )}
          {useAuthGard({ key: "admin-delete" }) && (
            <ActionButton
              className={`btn btn-outline text-[#E20000B2] text-[10px] lg:text-lg ${
                !isDeleteEnabled && "cursor-not-allowed"
              }`}
              icon={<BiTrash className="xl:text-lg text-[#E20000B2]" />}
              label="Delete"
              method={handleDelete}
              isDisabled={!isDeleteEnabled}
            />
          )}

          {useAuthGard({ key: "admin-export" }) && (
            <ActionButton
              className="btn text-[10px] lg:text-lg btn-outline"
              icon={<BiExport />}
              label="Export"
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
        />
        {/* Category Bar */}
        <SelectCategoryInput
          categories={categories}
          onSelectCategory={(category) => setSelectedCategory(category)}
          selectedCategory={selectedCategory}
        />
        {/* Status Bar */}
        <StatusInput
          onSelectStatus={(status) => setSelectedStatus(status)}
          selectedStatus={selectedStatus}
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
        <AdminForm onModalOpen={(modalState) => setIsModalOpen(modalState)} />
      )}
    </div>
  );
};

export default Admins;
