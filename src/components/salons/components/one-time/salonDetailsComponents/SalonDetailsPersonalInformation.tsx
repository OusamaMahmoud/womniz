import SalonHeader from "../../reuseable/SalonHeader";

const SalonDetailsPersonalInformation = () => {
  return (
    <div className="max-w-3xl mt-4 shadow-xl p-4 rounded-lg">
      <SalonHeader title="Personal Information" subtitle=""/>
      <div className="pl-10 mt-8 flex flex-col gap-5 max-w-xl">
        <div className=" flex flex-col gap-2">
            <h3 className="text-xl font-semibold capitalize">name</h3>
            <p className="text-lg opacity-25">Osama Shata</p>
        </div>
        <div className=" flex flex-col gap-2">
            <h3 className="text-xl font-semibold capitalize">email</h3>
            <p className="text-lg opacity-25">Osama Shata</p>
        </div>
        <div className=" flex flex-col gap-2">
            <h3 className="text-xl font-semibold capitalize">phone number</h3>
            <p className="text-lg opacity-25">Osama Shata</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
            <div className=" flex flex-col gap-2">
                <h3 className="text-xl font-semibold capitalize">work start day</h3>
                <p className="text-lg opacity-25">Osama Shata</p>
            </div>
            <div className=" flex flex-col gap-2">
                <h3 className="text-xl font-semibold capitalize">work end day</h3>
                <p className="text-lg opacity-25">Osama Shata</p>
            </div>
            <div className=" flex flex-col gap-2">
                <h3 className="text-xl font-semibold capitalize">work start time</h3>
                <p className="text-lg opacity-25">Osama Shata</p>
            </div>
            <div className=" flex flex-col gap-2">
                <h3 className="text-xl font-semibold capitalize">work start time</h3>
                <p className="text-lg opacity-25">Osama Shata</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDetailsPersonalInformation;
