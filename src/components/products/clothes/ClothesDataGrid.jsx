import { CompactTable } from "@table-library/react-table-library/compact";
import { useSort } from "@table-library/react-table-library/sort";
import { clothes } from "../../../data/dummy";

const ClothesDataGrid = () => {
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
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">SKU</span>
      ),
      renderCell: (item) => (
        <p className="text-sm xl:text-lg p-4">{item.sku}</p>
      ),
      sort: { sortKey: "SKU" },
    },
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">
          Product Name
        </span>
      ),
      renderCell: (item) => (
        <p className="flex gap-2 items-center text-sm xl:text-lg p-4">
          <img src="/assets/vendor/hoodie.svg" /> {item.productName}
        </p>
      ),
      sort: { sortKey: "PRODUCT_NAME" },
    },
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">
          Vendor
        </span>
      ),
      renderCell: (item) => (
        <p className="text-sm xl:text-lg p-4">{item.vendor}</p>
      ),
      sort: { sortKey: "VENDOR" },
    },
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">
          Brand
        </span>
      ),
      renderCell: (item) => (
        <p className="text-sm xl:text-lg p-4">{item.brand}</p>
      ),
      sort: { sortKey: "BRAND" },
    },
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">
          Sub Category
        </span>
      ),
      renderCell: (item) => (
        <p className="text-sm xl:text-lg p-4">{item.subCategory}</p>
      ),
      sort: { sortKey: "SUB_CATEGORY" },
    },
    {
      label: (
        <span className="text-lg xl:text-xl font-extrabold mr-1 p-2">
          Quantity
        </span>
      ),
      renderCell: (item) => (
        <p className="text-sm xl:text-lg p-4">{item.quantity}</p>
      ),
      sort: { sortKey: "QUANTITY" },
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
          Total Orders Num
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
    <>
      <CompactTable columns={COLUMNS} data={data} sort={sort} />
    </>
  );
};

export default ClothesDataGrid;
