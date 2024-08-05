import { MdDelete } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { BiUpload } from "react-icons/bi";
import { FaFileExport } from "react-icons/fa";
import apiClient from "../../../services/api-client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import useProducts from "../../../hooks/useProducts";
import useVendorCategories from "../../../hooks/useVendorCategories";
import useAllProducts from "../../../hooks/useAllProducts";
import Pagination from "../../Pagination";
import CosmeticsTable from "./CosmeticsTable";

const Cosmetics = () => {
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

  const exportToExcel = () => {
    // Create a new workbook and a sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(allProducts);

    // Append the sheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // Generate a binary string representation of the workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert the binary string to an array buffer
    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < wbout.length; i++) {
      view[i] = wbout.charCodeAt(i) & 0xff;
    }

    // Create a Blob from the array buffer and trigger the download
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      "products.xlsx"
    );
  };

  //CATEGORIES
  const { vendorCategories } = useVendorCategories();
  const cosmeticsCategory = vendorCategories.find(
    (i) => i.name.toLowerCase() === "Cosmetics".toLowerCase()
  );

  useEffect(() => {
    console.log("look here => ",cosmeticsCategory?.id);
  }, [cosmeticsCategory]);

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
      handleUpload();
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiClient.post("/products/bulk/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("File uploaded successfully");
      setFile(null);
    } catch (error) {
      toast.error("Failed to upload file");
      setFile(null);
    }
  };

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
    category: cosmeticsCategory?.id.toString(),
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
  const [isProductsDeleted, setProductsDeleted] = useState(false);

  const handleDelete = async () => {
    if (selectedProducts.size > 0) {
      const data = new FormData();
      Array.from(selectedProducts).forEach((id, index) => {
        data.append(`ids[${index}]`, id.toString());
      });
      try {
        setProductsDeleted(true);
        await apiClient.post("/products/delete", data);
        toast.success("Products have been deleted successfully.");
        setSelectAll(false);
        // Update the local products list
        const remainingProducts = products.filter(
          (product) => !selectedProducts.has(product.id)
        );
        setProducts(remainingProducts);
        setProductsDeleted(false);
      } catch (error) {
        toast.error("Failed to delete admins");
        setProducts(products);
        setProductsDeleted(false);
      }
    }
  };
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
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The page you requested couldn't be found. This might be because:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-10">
            <li>The URL was mistyped</li>
            <li>The page has moved or no longer exists</li>
            <li>You found a broken link</li>
          </ul>
        </div>
      ) : (
        <p className="my-4 text-lg text-red-500 tracking-wider">
          {clothesServerError}
        </p>
      )}

      {!clothesServerError && (
        <>
          <div className="flex items-center gap-8 justify-end mb-8">
            <Link
              to={"cosmetics-sub-category"}
              className="flex gap-2 items-center text-white bg-[#577656] hover:text-black btn xl:px-12 xl:text-lg"
            >
              Sub Category
            </Link>
            <Link
              to={"/products/cosmetics/new-product"}
              className="flex gap-2 items-center btn text-white bg-[#577656] hover:text-black xl:text-xl"
            >
              <IoAdd className="text-white text-2xl hover:text-black" /> Add New
              Product
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
              onClick={handleDelete}
              className={`btn btn-outline text-[#E20000B2] text-[10px] lg:text-lg ${
                !isDeleteEnabled && "cursor-not-allowed"
              }`}
              disabled={!isDeleteEnabled}
            >
              <MdDelete className="text-2xl text-red-700 " />{" "}
              {isProductsDeleted ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={exportToExcel}
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
              {cosmeticsCategory?.brands.map((b, idx) => (
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
        <CosmeticsTable
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

export default Cosmetics;
