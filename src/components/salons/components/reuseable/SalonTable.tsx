import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";

interface TableProps<T> {
  headers: string[]; // Column headers
  keys: (keyof T)[]; // Keys corresponding to data fields for each column
  data: T[]; // Array of data to populate the table rows
  rowKey: keyof T; // Key to uniquely identify each row
  route: string;
}

const SalonTable = <T,>({
  headers,
  keys,
  data,
  rowKey,
  route,
}: TableProps<T>) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
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
            <tr key={`${row[rowKey]}`} className="hover:bg-gray-100">
              {keys.map((key, colIndex) => (
                <td
                  onClick={() => navigate(`${route}`)}
                  key={colIndex}
                  className="px-4 py-4 border-b"
                >
                  {(row as any)[key]}
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
