import { MdDelete } from "react-icons/md";
import { FaFileExport } from "react-icons/fa";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import useProducts from "../../../hooks/useProducts";
import AllProductsTable from "./AllProductsTable";
import { exportToExcel } from "../../methods/exportToExcel";
import NotFound from "../../error-page/NotFound";
import { handleBulkUpload } from "../../methods/handleBulkUpload";
import useDeleteProducts from "../../../hooks/useDeleteProducts";
import BulkUpload from "./productsUI-sections/BulkUpload";
import { HeadingOne } from "../../reuse-components/HeadingOne";
import useBrands from "../../../hooks/useBrands";
import CustomPagination from "../../reuse-components/pagination/CustomPagination";

const AllProducts = () => {
  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilters, setSearchFilters] = useState("");

  const [file, setFile] = useState<File | null>(null);
  // NOTE tHAT
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );

  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);
  const [brand, setBrand] = useState<string>("");
  const [currentPage, setCurrentPage] = useState("1");
  const {
    products,
    setProducts,
    meta,
    isLoading,
    error: productServerError,
    links,
  } = useProducts({
    page: currentPage,
    brand,
    search: searchFilters,
    status: statusFilter,
  });

  useEffect(() => {
    setCurrentPage("1");
  }, [brand, statusFilter]);

  // Handle Pagination.
  const handleCheckAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allProducts = products.map((product) => product.id);
      setSelectedProducts(new Set(allProducts));
    } else {
      setSelectedProducts(new Set());
    }
  };

  // Handle Delete Button!!
  useEffect(() => {
    setIsDeleteEnabled(selectedProducts.size > 0);
  }, [selectedProducts]);

  const handleCheckboxChange = (id: number) => {
    const newSelectedProducts = new Set(selectedProducts);
    if (newSelectedProducts.has(id)) {
      newSelectedProducts.delete(id);
    } else {
      newSelectedProducts.add(id);
    }
    setSelectedProducts(newSelectedProducts);
  };

  const { deleteProducts, isProductsDeleted } = useDeleteProducts({
    selectedProducts,
    products,
    setSelectAll,
    setProducts,
    setIsDeleteEnabled,
  });

  // Inside your component

  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
  useEffect(() => {
    if (bulkUploadFile !== null) {
      try {
        handleBulkUpload({ bulkFile: bulkUploadFile });
        setFile(null);
      } catch (error) {
        setFile(null);
      }
    }
  }, [file, bulkUploadFile]);
  // Bulk Upload!!
  const handleBulkUploadBtn = (file: File) => {
    setBulkUploadFile(file);
  };
  const { brands } = useBrands(false, "");
  function getPageNumber(url: string) {
    const urlObj = new URL(url); // Parse the URL
    return urlObj.searchParams.get("page"); // Get the value of the 'page' query parameter
  }
  return (
    <div className="flex flex-col ">
      <ToastContainer />
      {productServerError.includes("404") ? (
        <NotFound />
      ) : (
        <p className="my-4 text-lg text-red-500 tracking-wider">
          {productServerError}
        </p>
      )}

      {!productServerError && (
        <>
          <div className=" flex justify-between items-center">
            <HeadingOne label="Products" marginBottom="2" />
            <BulkUpload onBulkUpload={handleBulkUploadBtn} />
          </div>
          <div className="flex items-center gap-8 justify-end mb-6">
            <button
              onClick={deleteProducts}
              className={`btn btn-outline text-[#E20000B2] text-[10px] lg:text-lg ${
                !isDeleteEnabled && "cursor-not-allowed"
              }`}
              disabled={!isDeleteEnabled}
            >
              <MdDelete className="text-2xl text-red-700 " />{" "}
              {isProductsDeleted ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() =>
                exportToExcel({ products: products, label: "All_Products" })
              }
              className="flex gap-2 items-center btn btn-outline xl:px-10 xl:text-lg"
            >
              <FaFileExport className="text-2xl " /> Export
            </button>
          </div>
          <div className="flex gap-8 mb-8">
            <label className="input input-bordered flex items-center gap-2 max-w-xs">
              <input
                value={searchFilters}
                onChange={(e) => {
                  setSearchFilters(e.currentTarget.value);
                }}
                type="text"
                className=""
                placeholder="Search"
              />
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
            </label>
            <select
              value={brand}
              id="brand"
              className="select select-bordered"
              onChange={(e) => {
                setBrand(e.currentTarget.value);
              }}
            >
              <option value="" selected>
                Select Brand
              </option>
              {brands.map((b, idx) => (
                <option key={idx} value={b.id}>
                  {b.name_en}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => {
                setStatusFilter(e.currentTarget.value);
              }}
              value={statusFilter}
              className="select select-bordered  max-w-xs"
            >
              <option value={""} selected>
                Select Status
              </option>
              <option value={"live"}>Live</option>
              <option value={"rejected"}>Rejected</option>
              <option value={"deactivated"}>Deactivated</option>
              <option value={"draft"}>Draft</option>
            </select>
          </div>
        </>
      )}

      {!isLoading ? (
        <AllProductsTable
          handleCheckAll={handleCheckAll}
          selectAll={selectAll}
          handleCheckboxChange={handleCheckboxChange}
          selectedObjects={selectedProducts}
          products={products}
        />
      ) : (
        <div className="flex w-full flex-col gap-4">
          <div className="skeleton h-80 w-full"></div>
          <div className="skeleton h-8 w-28"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
        </div>
      )}

      {!productServerError && (
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
      )}
    </div>
  );
};

export default AllProducts;
