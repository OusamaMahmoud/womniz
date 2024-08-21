import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = ({
  products,
  label,
}: {
  products: any[];
  label: string;
}) => {
  // Create a new workbook and a sheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(products);

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
    `${label}.xlsx`
  );
};

