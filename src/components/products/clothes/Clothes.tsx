import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { BiUpload } from "react-icons/bi";
import { FaFileExport } from "react-icons/fa";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ClothesTable from "./ClothesTable";
import useProducts from "../../../hooks/useProducts";
import useVendorCategories from "../../../hooks/useVendorCategories";
import useAllProducts from "../../../hooks/useAllProducts";
import Pagination from "../../Pagination";
import useDeleteProducts from "../../../hooks/useDeleteProducts";
import { exportToExcel } from "../../methods/exportToExcel";
import { handleBulkUpload } from "../../methods/handleBulkUpload";
import NotFound from "../../error-page/NotFound";

const Clothes = () => {
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

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  // Export products as excel sheet
  const { allProducts } = useAllProducts();

  //CATEGORIES
  const { vendorCategories } = useVendorCategories();
  const clothesCategory = vendorCategories.find(
    (i) => i.name.toLowerCase() === "Clothes".toLowerCase()
  );

  useEffect(() => {
    setIsDeleteEnabled(selectedProducts.size > 0);
  }, [selectedProducts]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (file !== null) {
      handleBulkUpload({ bulkFile: file });
    }
  }, [file]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationPage, setPaginationPage] = useState<string>("1");

  const {
    products,
    setProducts,
    meta,
    next,
    prev,
    error: clothesServerError,
    isLoading,
  } = useProducts({
    category: clothesCategory?.id.toString(),
    page: paginationPage,
    brand,
    search: searchFilters,
    status: statusFilter,
  });

  const recordsPerPage = meta.per_page || 5;
  const nPages = Math.ceil(products.length / recordsPerPage);

  const handleCheckAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allProducts = products.map((product) => product.id);
      setSelectedProducts(new Set(allProducts));
    } else {
      setSelectedProducts(new Set());
    }
  };
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
  const navigate = useNavigate();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedCategory(selectedValue);
    if (selectedValue) {
      navigate(`/products/${selectedValue}`);
    }
  };

  return (
    <div className="flex flex-col ">
      <ToastContainer />
      {clothesServerError.includes("404") ? (
        <NotFound />
      ) : (
        <p className="my-4 text-lg text-red-500 tracking-wider">
          {clothesServerError}
        </p>
      )}

      {!clothesServerError && (
        <>
          <div className="flex items-center gap-8 justify-end mb-8">
            <Link
              to={"cloths-sub-category"}
              className="flex gap-2 items-center text-white bg-[#577656] hover:text-black btn xl:px-12 xl:text-lg"
            >
              Sub Category
            </Link>
            <label
              htmlFor="excel"
              // onClick={handleUpload}
              className="flex gap-2 items-center text-white bg-[#577656] hover:text-black btn xl:px-12 xl:text-lg"
            >
              <BiUpload /> Bulk Upload
              <input
                id="excel"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                hidden
              />
            </label>
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
                exportToExcel({ products: allProducts, label: "Clothes" })
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
              value={selectedCategory}
              className="select select-bordered"
              onChange={handleCategoryChange}
            >
              <option value="" disabled>
                Select App Sub Category
              </option>
              {vendorCategories?.map((category, idx) => (
                <option key={idx} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
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
              {clothesCategory?.brands.map((b, idx) => (
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
        <ClothesTable
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

      {!clothesServerError && (
        <div className="mt-8">
          <Pagination
            onPage={(pg: string) => setPaginationPage(pg)}
            itemsPerPage={recordsPerPage}
            nPages={nPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            next={next}
            prev={prev}
          />
        </div>
      )}
    </div>
  );
};

export default Clothes;
