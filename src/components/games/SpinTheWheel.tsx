import React, { useState } from "react";
import useSpinGame from "../../hooks/useSpinGame";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
interface IFormInput {
  [key: string]: string | number;
}

const SpinTheWheel: React.FC = () => {
  const { spinGameInform } = useSpinGame();
  const { register, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      spinInput_0: spinGameInform.digit_one,
      spinInput_1: spinGameInform.digit_two,
      spinInput_2: spinGameInform.digit_three,
      spinInput_3: spinGameInform.digit_four,
      spinInput_4: spinGameInform.digit_five,
      spinInput_5: spinGameInform.digit_six,
      spinInput_6: spinGameInform.digit_seven,
      spinInput_7: spinGameInform.digit_eight,
      spinInput_8: spinGameInform.digit_nine,
    },
  });

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container mx-auto px-6 flex flex-col"
    >
      <div className="flex justify-between items-center my-10">
        <h1 className="text-4xl text-[#577656]">Spin the Wheel</h1>
        <p className="text-4xl text-[#6A6868]">59 : 00</p>
      </div>
      <div className="flex flex-col justify-center items-center w-fit self-center">
        <div>
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
            register={register}
            inputName={`spinInput_${index}`}
          />
        ))}
      </div>
      <button className="text-2xl bg-[#577656] text-white rounded-md px-20 py-4 self-center mt-8 hover:bg-[#A0D8B3] transition-all duration-150">
        Apply
      </button>
    </form>
  );
};

export default SpinTheWheel;

interface SpinInputProps {
  title: string;
  digit: number | string;
  register: UseFormRegister<IFormInput>;
  inputName: string;
}

const SpinInput: React.FC<SpinInputProps> = ({
  title,
  digit,
  register,
  inputName,
}) => {
  // const isSpinAgain = typeof digit === "string";
  const [isChecked, setChecked] = useState<boolean>(typeof digit === "string");
  const handleCheckedBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.currentTarget.checked);
  };

  return (
    <div className="mt-10">
      <h2 className="text-4xl font-semibold">{title}</h2>
      <div className="flex flex-col my-5 w-full">
        <label className="label text-[#475467] text-xl">
          Discount percentage
        </label>
        <div className="flex gap-4 justify-center items-center">
          {isChecked ? (
            <input
              {...register(inputName)}
              type="number"
              className="input input-bordered xl:w-[500px]"
              disabled
            />
          ) : (
            <input
              {...register(inputName)}
              defaultValue={digit}
              type="number"
              className="input input-bordered xl:w-[500px]"
            />
          )}
          <div>
            <input
              className="mr-2"
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckedBox}
            />
            <span>Spin again</span>
          </div>
        </div>
      </div>
    </div>
  );
};
