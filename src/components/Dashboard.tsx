import { useAuth } from "../contexts/AuthProvider";
import usePermissions from "../hooks/usePremissions";

const Dashboard = () => {
  const { auth } = useAuth();
  const { permissions } = usePermissions();

  if (!auth)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="loader-animation">
            <img
              src="/assets/logo.svg" // Replace with your logo path
              alt="Loading..."
              className="h-64 w-64 animate-zoom"
            />
          </div>
        </div>
      </div>
    );
  if (auth && permissions.length < 1)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="loader-animation">
            <img
              src="/assets/logo.svg" // Replace with your logo path
              alt="Loading..."
              className="h-64 w-64 animate-zoom"
            />
          </div>
        </div>
      </div>
    );
  return (
    <div className="flex flex-wrap gap-6 max-w-7xl">
      {auth && (
        <>
          <img src="/assets/dashboard/dashboard1.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard2.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard3.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard4.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard2.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard1.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard4.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard3.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard1.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard4.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard3.svg" alt="dashboard" />
          <img src="/assets/dashboard/dashboard2.svg" alt="dashboard" />
        </>
      )}
    </div>
  );
};

export default Dashboard;
