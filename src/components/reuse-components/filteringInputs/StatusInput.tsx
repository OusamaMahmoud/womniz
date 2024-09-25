import { useEffect } from "react";

export const StatusInput = ({
  selectedStatus,
  onSelectStatus,
}: {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}) => {
  useEffect(() => {
    onSelectStatus(selectedStatus);
  }, [selectedStatus]);

  return (
    <select
      className="select select-bordered"
      onChange={(e) => onSelectStatus(e.target.value)}
      value={selectedStatus}
    >
      <option value="">ALL</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  );
};
