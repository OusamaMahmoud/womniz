import React from "react";
import useSpinGame from "../../hooks/useSpinGame";

const SpinTheWheel: React.FC = () => {
  const { spinGameInform } = useSpinGame();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Logic to handle input change, if needed
  };

  return (
    <div className="container mx-auto px-6 flex flex-col">
      <div className="flex justify-between items-center my-10">
        <h1 className="text-4xl text-[#577656]">Spin the Wheel</h1>
        <p className="text-4xl text-[#6A6868]">59 : 00</p>
      </div>
      <div className="flex flex-col justify-center items-center w-fit self-center">
        <div className="">
          <img src="/assets/games/wheel.svg" alt="Spin the Wheel" />
        </div>
        {[
          { title: "1-Lucky shot", digit: spinGameInform.digit_one },
          { title: "2-Medium gifts", digit: spinGameInform.digit_two },
          { title: "3-Small gifts", digit: spinGameInform.digit_three },
          { title: "4-Spin again", digit: spinGameInform.digit_four },
          { title: "5-Big gifts", digit: spinGameInform.digit_five },
          { title: "6-Small gifts", digit: spinGameInform.digit_six },
          { title: "7-Spin again", digit: spinGameInform.digit_seven },
          { title: "8-Medium gifts", digit: spinGameInform.digit_eight },
          { title: "9-Big gifts", digit: spinGameInform.digit_nine },
        ].map((spin, index) => (
          <SpinInput
            key={index}
            title={spin.title}
            digit={spin.digit}
            onChange={handleInputChange}
          />
        ))}
      </div>
      <button className="text-2xl bg-[#577656] text-white rounded-md px-20 py-4 self-center mt-8 hover:bg-[#A0D8B3] transition-all duration-150">
        Apply
      </button>
    </div>
  );
};

export default SpinTheWheel;


interface SpinInputProps {
  title: string;
  digit: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SpinInput: React.FC<SpinInputProps> = ({ title, digit, onChange }) => {
  const isSpinAgain = typeof digit === "string";

  return (
    <div className="mt-10">
      <h2 className="text-4xl font-semibold">{title}</h2>
      <div className="flex flex-col my-5 w-full">
        <label className="label text-[#475467] text-xl">Discount percentage</label>
        <div className="flex gap-4 justify-center items-center">
        {isSpinAgain ? <input
            type="number"
            className="input input-bordered xl:w-[500px]"
            onChange={onChange}
            disabled
          /> :
          <input
            defaultValue={digit}
            type="number"
            className="input input-bordered xl:w-[500px]"
            onChange={onChange}
          /> 
          }
          <div>
            <input type="checkbox" checked={isSpinAgain}  /> <span>Spin again</span>
          </div>
        </div>
      </div>
    </div>
  );
};
