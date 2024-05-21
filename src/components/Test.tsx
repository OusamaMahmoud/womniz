import axios from "axios";
import { useEffect, useState } from "react";
import { Admin } from "./Admins";
const Test = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    axios
      .get<Admin[]>("http://localhost:5000/admins")
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the admins!", error);
      });
  }, []);

  return (
    <div>
      <h1>Admin List</h1>
      <ul>
        {admins.map((admin) => (
          <li key={admin.id}>
            {admin.name} - {admin.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Test;
