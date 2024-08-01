import { useEffect, useState } from "react";
import OrdersTable from "./OrdersTable";
import RequestDateCalender from "../RequestDateCalender";
import { toast } from "react-toastify";
import apiClient from "../../services/api-client";
import { MdDelete } from "react-icons/md";
import { FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useOrders from "../../hooks/useOrders";
import Pagination from "../Pagination";

const Orders = ({ specificStatus }: { specificStatus: string }) => {
  const [date, setDate] = useState("");
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedOrders, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );
  const [isDeleteEnabled, setIsDeleteEnabled] = useState<boolean>(false);
  const [isProductsDeleted, setProductsDeleted] = useState(false);
  const [searchFilters, setSearchFilters] = useState("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationPage, setPaginationPage] = useState<string>("1");

  const {
    orders,
    setOrders,
    isLoading,
    meta,
    next,
    prev,
    error: ordersServerError,
  } = useOrders({
    search: searchFilters,
    date,
    page: paginationPage,
    status: specificStatus,
  });

  const recordsPerPage = meta.per_page || 5;
  const nPages = Math.ceil(orders.length / recordsPerPage);
  const handleDelete = async () => {
    if (selectedOrders.size > 0) {
      const data = new FormData();
      Array.from(selectedOrders).forEach((id, index) => {
        data.append(`ids[${index}]`, id.toString());
      });
      try {
        setProductsDeleted(true);
        await apiClient.post("/orders/delete", data);
        toast.success("Products have been deleted successfully.");
        setSelectAll(false);

        // Update the local products list
        const remainingOrders = orders.filter(
          (order) => !selectedOrders.has(order.id)
        );
        setOrders(remainingOrders);
        setProductsDeleted(false);
      } catch (error) {
        toast.error("Failed to delete admins");
        setOrders(orders);
        setProductsDeleted(false);
      }
    }
  };

  useEffect(() => {
    setIsDeleteEnabled(selectedOrders.size > 0);
  }, [selectedOrders]);

  const handleCheckAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allProducts = orders.map((order) => order.id);
      setSelectedProducts(new Set(allProducts));
    } else {
      setSelectedProducts(new Set());
    }
  };
  const handleCheckboxChange = (id: number) => {
    const newSelectedProducts = new Set(selectedOrders);
    if (newSelectedProducts.has(id)) {
      newSelectedProducts.delete(id);
    } else {
      newSelectedProducts.add(id);
    }
    setSelectedProducts(newSelectedProducts);
  };

  const exportToExcel = () => {
    // Create a new workbook and a sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(orders);

    // Append the sheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

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
      "orders.xlsx"
    );
  };

  return (
    <div className="container mx-auto px-10">
      {ordersServerError.includes("404") ? (
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
          {ordersServerError}
        </p>
      )}

      {!ordersServerError && (
        <div className="flex justify-between">
          <div className="flex gap-10 items-center mb-10">
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
            <RequestDateCalender
              onSelectedDate={(selectedDate: string) => {
                setDate(selectedDate);
              }}
            />
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
        </div>
      )}
      {!isLoading ? (
        <div className="mt-8">
          <OrdersTable
            handleCheckAll={handleCheckAll}
            selectAll={selectAll}
            handleCheckboxChange={handleCheckboxChange}
            selectedObjects={selectedOrders}
            products={orders}
            serverErrors={ordersServerError}
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
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <div className="skeleton h-80 w-full"></div>
          <div className="skeleton h-8 w-28"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
        </div>
      )}
    </div>
  );
};

export default Orders;
