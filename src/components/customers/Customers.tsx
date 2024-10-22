import React, { useState, useEffect } from "react";
import { BiExport, BiPlusCircle, BiTrash } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../services/api-client";
import useMainCategories from "../../hooks/useMainCategories";
import Pagination from "../Pagination";
import useCustomers from "../../hooks/useCustomers";
import useAllCustomers from "../../hooks/useAllCustomers";
import CustomerResponsiveTable from "./CustomerResponsiveTable";
import CustomerForm from "./components/CustomerForm";
import { TableSkeleton } from "../reuse-components/TableSkeleton";
import { StatusInput } from "../reuse-components/filteringInputs/StatusInput";
import { SelectCategoryInput } from "../reuse-components/filteringInputs/SelectCategoryInput";
import { SearchInput } from "../reuse-components/filteringInputs/SearchInput";
import { ActionButton } from "../reuse-components/ActionButtons";
import { useAuthGard } from "../reuse-hooks/AuthGard";
import { HeadingOne } from "../reuse-components/HeadingOne";
import { exportToExcel } from "../methods/exportToExcel";
import { useTranslation } from "react-i18next";
// ZOD SCHEMA

const Customers: React.FC = () => {
  // Handle Filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedCustomers, setSelectedCustomers] = useState<Set<number>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);

  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);


  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationPage, setPaginationPage] = useState<string>("1");
  const { categories } = useMainCategories();

  const { customers, isLoading, meta, next, prev } = useCustomers({
    categories: selectedCategory,
    status: selectedStatus,
    search: searchValue,
    isFetching: trigerFetch,
    page: paginationPage,
  });

  const recordsPerPage = meta.per_page || 5;
  const nPages = Math.ceil(customers.length / recordsPerPage);


  const openModal = () => {
    setIsModalOpen(true);
  };


  useEffect(() => {
    setIsDeleteEnabled(selectedCustomers.size > 0);
  }, [selectedCustomers]);

  const handleCheckAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allAdminIds = customers.map((customer) => customer.id);
      setSelectedCustomers(new Set(allAdminIds));
    } else {
      setSelectedCustomers(new Set());
    }
  };

  const handleCheckboxChange = (id: number) => {
    const newSelectedCustomers = new Set(selectedCustomers);
    if (newSelectedCustomers.has(id)) {
      newSelectedCustomers.delete(id);
    } else {
      newSelectedCustomers.add(id);
    }
    setSelectedCustomers(newSelectedCustomers);
  };

  const handleDelete = async () => {
    if (selectedCustomers.size > 0) {
      const data = new FormData();
      Array.from(selectedCustomers).forEach((id, index) => {
        data.append(`ids[${index}]`, id.toString());
      });
      try {
        await apiClient.post("/users/delete", data);
        toast.success("Customers deleted successfully");
        setTrigerFetch(!trigerFetch);
        setSelectAll(false);
        setIsDeleteEnabled(false);
      } catch (error) {
        toast.error("Failed to delete Customers");
      }
    }
  };

  const { allacustomers, isAllCustomersError } = useAllCustomers();
const {t} = useTranslation()
  return (
    <div className="overflow-x-scroll p-5">
      <ToastContainer />

      {/* ACTION BUTTONS */}
      <div className="justify-between items-center lg:flex mb-5">
        {isAllCustomersError && (
          <p className="text-red-600 text-lg p-2">{isAllCustomersError}</p>
        )}
        <HeadingOne label={t('customers:customers.header')}  marginBottom="2" />
        <div className="flex items-center flex-wrap gap-2">
          {useAuthGard({ key: "user-create" }) && (
            <ActionButton
              icon={<BiPlusCircle className="text-xl" />}
              className="btn bg-[#577656] text-[white] text-[10px] lg:text-lg"
              method={openModal}
              label={t('customers:customers.customerButtons.add')}
            />
          )}
          {useAuthGard({ key: "user-delete" }) && (
            <ActionButton
              className={`btn btn-outline text-[#E20000B2] text-[10px] lg:text-lg ${
                !isDeleteEnabled && "cursor-not-allowed"
              }`}
              icon={<BiTrash className="xl:text-lg text-[#E20000B2]" />}
              isDisabled={!isDeleteEnabled}
              label={t('customers:customers.customerButtons.delete')}
              method={handleDelete}
            />
          )}
          {useAuthGard({ key: "user-export" }) && (
            <ActionButton
              className="btn btn-outline"
              method={() =>
                exportToExcel({
                  products: allacustomers,
                  label: "customers",
                })
              }
              label={t('customers:customers.customerButtons.export')}
              icon={<BiExport />}
            />
          )}
        </div>
      </div>
      {/* Handle Filters */}
      <div className="my-6 flex items-center flex-wrap gap-3">
        <SearchInput
          onSearchText={(text) => setSearchValue(text)}
          searchText={searchValue}
          placeHolder={t('customers:customersPlaceholders.search')}
        />
        <SelectCategoryInput
          categories={categories}
          onSelectCategory={(category) => setSelectedCategory(category)}
          selectedCategory={selectedCategory}
          placeHolder={t('customers:customersPlaceholders.category')}
        />
        <StatusInput
          onSelectStatus={(status) => setSelectedStatus(status)}
          selectedStatus={selectedStatus}
          placeHolder={t('customers:customersPlaceholders.status')}
        />
      </div>
      {/* Table */}
      {isLoading ? (
        <TableSkeleton noOfElements={6} />
      ) : (
        <>
          <CustomerResponsiveTable
            tableData={customers}
            handleCheckAll={handleCheckAll}
            selectAll={selectAll}
            handleCheckboxChange={handleCheckboxChange}
            selectedObjects={selectedCustomers}
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
        <CustomerForm onModalOpen={(state) => setIsModalOpen(state)} />
      )}
    </div>
  );
};

export default Customers;
