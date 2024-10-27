import { useState } from "react";
import "tailwindcss/tailwind.css";

interface TableProps<T> {
  headers: string[]; // Column headers
  data: T[]; // Array of data to populate the table rows
  rowKey: keyof T; // Key to uniquely identify each row
}

const SalonTable = <T,>({ headers, data, rowKey }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="text-left px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={`${row[rowKey]}`} className="hover:bg-gray-100">
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border-b">
                  {(row as any)[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalonTable;
