import { useEffect } from "react";
import { json } from "react-router-dom";

const Dashboard = () => {
  const genreObject = { name: "os" };
  useEffect(() => {
    fetch("http://localhost:3000/api/genres/3", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // This should be correctly capitalized
      },
      body: JSON.stringify(genreObject),
    })
      .then((res) => res.json()) // Awaiting JSON response
      .then((data) => console.log(data)) // Logging resolved data
      .catch((err) => console.log(err));
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
