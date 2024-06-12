import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useSort } from "@table-library/react-table-library/sort";
import { clothes } from "../../data/dummy";
import { Link } from "react-router-dom";

const FinancialReportDataGrid = () => {


  const data = { nodes: clothes };

  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortFns: {
        SKU: (array) => array.sort((a, b) => a.sku.localeCompare(b.sku)),
        PRODUCT_NAME: (array) =>
          array.sort((a, b) => a.productName.localeCompare(b.productName)),
        VENDOR: (array) =>
          array.sort((a, b) => a.vendor.localeCompare(b.vendor)),
        BRAND: (array) => array.sort((a, b) => a.brand.localeCompare(b.brand)),
        SUB_CATEGORY: (array) =>
          array.sort((a, b) => a.subCategory.localeCompare(b.subCategory)),
        QUANTITY: (array) => array.sort((a, b) => a.quantity - b.quantity),
        PRICE: (array) => array.sort((a, b) => a.price - b.price),
        TOTAL_ORDERS_NUM: (array) =>
          array.sort((a, b) => a.totalOrdersNum - b.totalOrdersNum),
        STATUS: (array) =>
          array.sort((a, b) => a.status.localeCompare(b.status)),
      },
    }
  );

  function onSortChange(action, state) {
    console.log(action, state);
  }

  const COLUMNS = [
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">Date</span>
      ),
      renderCell: (item) => (
        <p className="text-sm xl:text-lg p-4">{item.date}</p>
      ),
      sort: { sortKey: "SKU" },
    },
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">
          Order Num
        </span>
      ),
      renderCell: (item) => (
        <p className="text-sm xl:text-lg p-4">{item.totalOrdersNum}</p>
      ),
      sort: { sortKey: "TOTAL_ORDERS_NUM" },
    },
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">
          Number Of Items
        </span>
      ),
      renderCell: (item) => (
        <p className="text-sm xl:text-lg p-4">{item.totalOrdersNum}</p>
      ),
      sort: { sortKey: "TOTAL_ORDERS_NUM" },
    },
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">
          Price
        </span>
      ),
      renderCell: (item) => (
        <p className="text-sm xl:text-lg p-4">${item.price.toFixed(2)}</p>
      ),
      sort: { sortKey: "PRICE" },
    },
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">
          Discount Womniz Only
        </span>
      ),
      renderCell: (item) => (
        <p className="text-sm xl:text-lg p-4">%{item.price.toFixed(2)}</p>
      ),
      sort: { sortKey: "PRICE" },
    },
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-4">
          Status
        </span>
      ),
      renderCell: (item) => (
        <p
          className={`badge text-sm xl:text-lg p-4 text-center ${
            item.status === "Live"
              ? "text-[#037847] bg-[#ECFDF3]"
              : item.status === "Rejected"
              ? "text-[#E20000] bg-[#E2000029]"
              : item.status === "Draft"
              ? "text-[#636366] bg-[#EDEDED]"
              : item.status === "Deactivated"
              ? "text-[#E20000] bg-[#E2000029]"
              : ""
          }`}
        >
          {item.status}
        </p>
      ),
      sort: { sortKey: "STATUS" },
    },
  ];

  return (
    <div className="z-10">
      <CompactTable columns={COLUMNS} data={data} sort={sort} />
    </div>
  );
};

export default FinancialReportDataGrid;
