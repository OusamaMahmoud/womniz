import { BiExport } from "react-icons/bi";
import { SearchIcon } from "lucide-react";
import { MdAdd, MdDelete } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import SalonHeader from "../../../../reuseable/SalonHeader";
import SalonInput from "../../../../reuseable/SalonInput";
import SalonInputSelect from "../../../../reuseable/SalonSelectInput";
import SalonTable from "../../../../reuseable/SalonTable";
interface TableData {
  id: string;
  Service_Category: string;
  Service_Name: string;
  Service_Price: string;
  Service_Sale: string;
  Service_Professional: string;
  Time_Taken: string;
}

const ServicesTables = ({ id }: { id: string }) => {
  const headers = [
    "id",
    "Service_Category",
    "Service_Name",
    "Service_Price",
    "Service_Sale",
    "Service_Professional",
    "Time_Taken",
    "Actions",
  ];

  const data: TableData[] = [
    {
      id: "1",
      Service_Category: "salon1",
      Service_Name: "salon1@gmail.com",
      Service_Price: "23",
      Service_Sale: "3",
      Service_Professional: "egypt",
      Time_Taken: "active",
    },
    {
      id: "1",
      Service_Category: "salon1",
      Service_Name: "salon1@gmail.com",
      Service_Price: "23",
      Service_Sale: "3",
      Service_Professional: "egypt",
      Time_Taken: "active",
    },
    {
      id: "1",
      Service_Category: "salon1",
      Service_Name: "salon1@gmail.com",
      Service_Price: "23",
      Service_Sale: "3",
      Service_Professional: "egypt",
      Time_Taken: "active",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="px-12">
      {id != "" && (
        <div>
          <SalonHeader title="Salons Services Details">
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
        </div>
      )}
      <div>
        <SalonTable data={data} headers={headers} rowKey="id" />
      </div>
    </div>
  );
};

export default ServicesTables;
