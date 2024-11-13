import { BiExport } from "react-icons/bi";
import SalonHeader from "../components/reuseable/SalonHeader";
import { SearchIcon } from "lucide-react";
import { MdAdd, MdDelete } from "react-icons/md";
import SalonInput from "../components/reuseable/SalonInput";
import SalonInputSelect from "../components/reuseable/SalonSelectInput";
import SalonTable from "../components/reuseable/SalonTable";
import { useNavigate } from "react-router-dom";
interface TableData {
  id: string;
  name: string;
  email: string;
  total_bookings: string;
  branches: string;
  country: string;
  status: string;
}

const Salons = () => {
  const headers = [
    "id",
    "name",
    "email",
    "total_bookings",
    "branches",
    "country",
    "status",
  ];

  const data: TableData[] = [
    {
      id: "1",
      name: "salon1",
      email: "salon1@gmail.com",
      total_bookings: "23",
      branches: "3",
      country: "egypt",
      status: "active",
    },
    {
      id: "2",
      name: "salon2",
      email: "salon2@gmail.com",
      total_bookings: "49",
      branches: "4",
      country: "egypt",
      status: "active",
    },
    {
      id: "3",
      name: "salon3",
      email: "salon3@gmail.com",
      total_bookings: "49",
      branches: "4",
      country: "egypt",
      status: "active",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="px-12">
      <div>
        <SalonHeader title="Salons Details">
          <button
            onClick={() => navigate("/salons/add-new-salon")}
            className="btn btn-outline"
          >
            <MdAdd />
            Add New Salon
          </button>
          <button className="btn btn-outline">
            <BiExport />
            Export
          </button>
          <button className="btn btn-outline">
            <MdDelete className="text-red-500 text-xl" />
            Delete
          </button>
        </SalonHeader>
        <div className="flex gap-4 mt-4">
          <SalonInput
            icon={<SearchIcon />}
            placeholder="Searching..."
            maxWidth="max-w-sm"
            type="text"
            label=""
          />
          <SalonInputSelect
            label=""
            name="Select_Category"
            options={[{ label: "Category1", value: "1" }]}
          />
          <SalonInputSelect
            label=""
            name="Select_Status"
            options={[{ label: "Status1", value: "1" }]}
          />
        </div>
        <div>
          <SalonTable
            data={data}
            headers={headers}
            rowKey="id"
            route="/salon-details"
            keys={[
              "id",
              "name",
              "email",
              "total_bookings",
              "branches",
              "country",
              "status",
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Salons;
