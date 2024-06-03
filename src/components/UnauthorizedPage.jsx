import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <div>
      <p className="mb-4 text-red text-2xl font-bold">Unauthorized!!</p>
      <p className="text-lg font-semibold">
        You don't have access to the Requested Page.
      </p>
      <button onAbort={goBack} className="btn btn-link">
        Go Back
      </button>
    </div>
  );
};

export default UnauthorizedPage;
