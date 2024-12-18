import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";

interface TableProps<T> {
  headers: string[]; // Column headers
  data: T[]; // Array of data to populate the table rows
  rowKey: keyof T; // Key to uniquely identify each row
}

const ProductsTable = <T,>({ headers, data, rowKey }: TableProps<T>) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left text-lg capitalize px-4 py-2 bg-slate-50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={`${row[rowKey]}`} className="hover:bg-gray-100 ">
              {headers.map((header, colIndex) => (
                <td
                  onClick={() => navigate("/salon-details")}
                  key={colIndex}
                  className="px-4 py-4  border-b"
                >
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

export default ProductsTable;
