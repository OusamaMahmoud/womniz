import { useState, useEffect } from "react";
import { BiExport, BiPlusCircle, BiTrash } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../services/api-client";
import useMainCategories from "../../hooks/useMainCategories";
import useVendors from "../../hooks/useVendors";
import useAllVendors from "../../hooks/useAllVendors";
import VendorsResponsiveTable from "./VendorsResponsiveTable";
import { TableSkeleton } from "../reuse-components/TableSkeleton";
import { ActionButton } from "../reuse-components/ActionButtons";
import { SearchInput } from "../reuse-components/filteringInputs/SearchInput";
import { SelectCategoryInput } from "../reuse-components/filteringInputs/SelectCategoryInput";
import { StatusInput } from "../reuse-components/filteringInputs/StatusInput";
import { HeadingOne } from "../reuse-components/HeadingOne";
import { useAuthGard } from "../reuse-hooks/AuthGard";
import VendorForm from "./components/VendorForm";
import { exportToExcel } from "../methods/exportToExcel";
import { useTranslation } from "react-i18next";
import CustomPagination from "../reuse-components/pagination/CustomPagination";

const Vendors = () => {
  // Handle Filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedVendors, setSelectedVendors] = useState<Set<number>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);
  const [trigerFetch, setTrigerFetch] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<string>("1");

  // Custom Hooks
  const { vendors, meta, links, isLoading } = useVendors({
    categories: selectedCategory,
    status: selectedStatus,
    search: searchValue,
    isFetching: trigerFetch,
    page: currentPage,
  });

  useEffect(() => {
    setCurrentPage("1");
  }, [selectedStatus]);

  const { mainCategories } = useMainCategories(false, "");
  const { isAllVendorsError } = useAllVendors();

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    setIsDeleteEnabled(selectedVendors.size > 0);
  }, [selectedVendors]);

  const handleCheckAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allVendorsIds = vendors.map((admin) => admin.id);
      setSelectedVendors(new Set(allVendorsIds));
    } else {
      setSelectedVendors(new Set());
    }
  };

  const handleCheckboxChange = (id: number) => {
    const newSelectedVendors = new Set(selectedVendors);
    if (newSelectedVendors.has(id)) {
      newSelectedVendors.delete(id);
    } else {
      newSelectedVendors.add(id);
    }
    setSelectedVendors(newSelectedVendors);
  };

  const handleDelete = async () => {
    if (selectedVendors.size > 0) {
      const data = new FormData();
      Array.from(selectedVendors).forEach((id, index) => {
        data.append(`ids[${index}]`, id.toString());
      });
      try {
        await apiClient.post("/vendors/delete", data);
        toast.success("Vendors deleted successfully");
        setTrigerFetch(!trigerFetch);
        setSelectAll(false);
        setIsDeleteEnabled(false);
      } catch (error) {
        toast.error("Failed to delete Vendors");
      }
    }
  };
  const { t } = useTranslation();
  function getPageNumber(url: string) {
    const urlObj = new URL(url); // Parse the URL
    return urlObj.searchParams.get("page"); // Get the value of the 'page' query parameter
  }
  return (
    <div className="overflow-x-scroll p-5">
      <ToastContainer />

      <div className="justify-between items-center lg:flex mb-5">
        {isAllVendorsError && (
          <p className="text-red-600 text-lg p-2">{isAllVendorsError}</p>
        )}

        <HeadingOne label={t("vendors:vendors.header")} marginBottom="4" />

        <div className="flex items-center flex-wrap gap-2">
          {useAuthGard({ key: "vendor-create" }) && (
            <ActionButton
              className="btn bg-[#577656] text-[white]"
              icon={<BiPlusCircle className="text-xl" />}
              method={openModal}
              label={t("vendors:vendors.vendorsButtons.add")}
            />
          )}
          {useAuthGard({ key: "vendor-delete" }) && (
            <ActionButton
              className={`btn btn-outline text-[#E20000B2] ${
                !isDeleteEnabled && "cursor-not-allowed"
              }`}
              icon={<BiTrash className="text-lg text-[#E20000B2]" />}
              method={handleDelete}
              label={t("vendors:vendors.vendorsButtons.delete")}
              isDisabled={!isDeleteEnabled}
            />
          )}
          {useAuthGard({ key: "vendor-export" }) && (
            <ActionButton
              className={`btn btn-outline`}
              icon={<BiExport />}
              method={() =>
                exportToExcel({ products: vendors, label: "vendors" })
              }
              label={t("vendors:vendors.vendorsButtons.export")}
            />
          )}
        </div>
      </div>

      <div className="my-6 flex items-center flex-wrap gap-3">
        <SearchInput
          onSearchText={(text: string) => setSearchValue(text)}
          searchText={searchValue}
          placeHolder={t("common:placeholders.search")}
        />
        <SelectCategoryInput
          onSelectCategory={(category: string) => setSelectedCategory(category)}
          categories={mainCategories}
          selectedCategory={selectedCategory}
          placeHolder={t("common:placeholders.category")}
        />
        <StatusInput
          onSelectStatus={(status: string) => setSelectedStatus(status)}
          selectedStatus={selectedStatus}
          placeHolder={t("common:placeholders.search")}
        />
      </div>

      {isLoading ? (
        <TableSkeleton noOfElements={6} />
      ) : (
        <>
          <VendorsResponsiveTable
            tableData={vendors}
            handleCheckAll={handleCheckAll}
            selectAll={selectAll}
            handleCheckboxChange={handleCheckboxChange}
            selectedObjects={selectedVendors}
          />
          <div className="mt-8">
            <CustomPagination
              links={links}
              meta={meta}
              handleGetFirstPage={() => {
                const result = getPageNumber(links.first);
                if (result) setCurrentPage(result);
              }}
              handleGetLastPage={() => {
                const result = getPageNumber(links.last);
                if (result) setCurrentPage(result);
              }}
              handleGetNextPage={() => {
                const result = getPageNumber(links.next);
                if (result) setCurrentPage(result);
              }}
              handleGetPrevPage={() => {
                const result = getPageNumber(links.prev);
                if (result) setCurrentPage(result);
              }}
            />
          </div>
        </>
      )}

      {isModalOpen && (
        <VendorForm
          onModalOpen={(modelState: boolean) => setIsModalOpen(modelState)}
        />
      )}
    </div>
  );
};

export default Vendors;
