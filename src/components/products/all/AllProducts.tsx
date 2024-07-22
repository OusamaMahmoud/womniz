import {
  MdDelete,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { BiUpload } from "react-icons/bi";
import { FaFileExport } from "react-icons/fa";
import apiClient from "../../../services/api-client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import useProducts from "../../../hooks/useProducts";
import useVendorCategories from "../../../hooks/useVendorCategories";
import { Brand } from "../../../services/vendor-category-sevice";
import AllProductsTable from "./AllProductsTable";

const AllProducts = () => {
    
  const [file, setFile] = useState<File | null>(null);
  // NOTE tHAT
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");

  //CATEGORIES
  const { vendorCategories } = useVendorCategories();

  const childs = vendorCategories.map((i) => ({ childs: i.childs, id: i.id }));
  const clothesCategory = vendorCategories.find((i) => i.name === "Clothes");
  const brandCategories = clothesCategory?.brands.map((b) => ({
    id: b.id,
    categories: b.categories,
  }));

  const [selectedBrand, setSelectedBrand] = useState<Partial<Brand>>(
    {} as Brand
  );

  useEffect(() => {
    if (brandCategories) {
      const selectedItem = brandCategories?.find((b) => b.id === Number(brand));
      if (selectedItem) {
        setSelectedBrand(selectedItem);
      }
    }
  }, [brand]);

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
  const { products } = useProducts({});

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
  const handleDelete = async () => {
    if (selectedProducts.size > 0) {
      const data = new FormData();
      Array.from(selectedProducts).forEach((id, index) => {
        data.append(`ids[${index}]`, id.toString());
      });
      try {
        await apiClient.post("/products/delete", data);
        toast.success("Products have been deleted successfully.");
        setSelectAll(false);
      } catch (error) {
        toast.error("Failed to delete admins");
      }
    }
  };

  return (
    <div className="flex flex-col ">
      <ToastContainer />
      <div className="flex items-center gap-8 justify-end mb-8">
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
          <MdDelete className="text-2xl text-red-700 " /> Delete
        </button>
        <button className="flex gap-2 items-center btn btn-outline xl:px-10 xl:text-lg">
          <FaFileExport className="text-2xl " /> Export
        </button>
      </div>
      <div className="flex gap-8 mb-8">
        <label className="input input-bordered flex items-center gap-2 max-w-xs">
          <input type="text" className="" placeholder="Search" />
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
          className="select select-bordered  "
          onChange={(e) => setSelectedCategory(e.currentTarget.value)}
        >
          <option value="" disabled selected>
            Select App Sub Category
          </option>
          {childs.map((i, idx) => (
            <option key={idx} value={`${i.childs[idx].id}`}>
              {i.childs[idx].name}
            </option>
          ))}
        </select>
        <select
          value={brand}
          id="brand"
          className="select select-bordered "
          onChange={(e) => setBrand(e.currentTarget.value)}
        >
          <option value="" disabled selected>
            Select Brand
          </option>
          {clothesCategory?.brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name_en}
            </option>
          ))}
        </select>
        <select className="select select-bordered w-full max-w-xs">
          <option disabled selected>
            Select Status
          </option>
          <option>Han Solo</option>
          <option>Greedo</option>
        </select>
      </div>
      <AllProductsTable
        handleCheckAll={handleCheckAll}
        selectAll={selectAll}
        handleCheckboxChange={handleCheckboxChange}
        selectedObjects={selectedProducts}
      />
      <div className="mt-8">
        <nav className="flex justify-between items-center">
          <p className="text-2xl ml-4">1-15 of 20 items</p>
          <ul className="flex items-center justify-end gap-10">
            <button className={`bg-[#B6C9B5] text-white rounded-lg `}>
              <MdKeyboardArrowLeft className="text-4xl" />
            </button>
            <div>
              <form className="flex items-center gap-2 ml-4">
                <input
                  type="text"
                  id="pageInput"
                  className="border-2 border-gray-300 rounded-md px-2 py-1 text-center w-16"
                />
              </form>
            </div>
            <p className="text-xl">
              {" "}
              of <span className="px-3 py-2 rounded-md font-bold">
                2
              </span> Pages{" "}
            </p>

            <button className={`bg-[#B6C9B5] text-white rounded-lg`}>
              <MdKeyboardArrowRight className="text-4xl" />
            </button>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AllProducts;
