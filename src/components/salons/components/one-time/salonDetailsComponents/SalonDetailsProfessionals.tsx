import { IoAddCircle } from "react-icons/io5";

const SalonDetailsProfessionals = () => {
  return (
    <div className="max-w-3xl mt-4 border p-10 rounded-lg">
      <h1 className="text-2xl font-semibold mb-2">Professionals</h1>
      <div className="flex gap-2 items-center bg-base-200 p-3 shadow-lg border w-fit rounded-md">
        <IoAddCircle className="text-xl" />
        <p className="text-xl font-bold ">Add Professional</p>
      </div>
    </div>
  );
};

export default SalonDetailsProfessionals;
