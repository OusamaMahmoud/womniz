import React, { useEffect, useState } from "react";
import useSpinGame from "../../hooks/useSpinGame";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { Spin } from "../../services/spinGame-service";
import apiClient from "../../services/api-client";

interface IFormInput {
  [key: string]: string | number;
}

const SpinTheWheel: React.FC = () => {
  const numberToWord = (num: number): string => {
    const words = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    return words[num - 1];
  };
  const { spinGameInform } = useSpinGame() as { spinGameInform: Spin };
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
  const [isGameSpinAgain, setGameSpinAgain] = useState<
    { name: string; bool: boolean }[]
  >([]);


  const onSubmit = async (data: FieldValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value], idx) => {
      const digitKey = `digit_${numberToWord(idx + 1)}` as keyof Spin;
      const inputName = `spinInput_${idx}`; // Get the input name
      // Check if the inputName is in isGameSpinAgain and if it is checked
      const isSpinAgain = isGameSpinAgain.some(
        (input) => input.name === inputName && input.bool
      );
      formData.append(
        digitKey,
        value === undefined && isSpinAgain
          ? 0
          : value === undefined
          ? `${
              spinGameInform[digitKey] === "spin_again"
                ? 0
                : spinGameInform[digitKey]
            }`
          : value
      );
    });

    const res = await apiClient.post("/spin/information/update", formData);
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
            onChecked={(inputName, isChecked) =>
              setGameSpinAgain((prev) => [
                ...prev,
                { name: inputName, bool: isChecked },
              ])
            }
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
  onChecked: (inputName: string, isChecked: boolean) => void;
}

const SpinInput: React.FC<SpinInputProps> = ({
  title,
  digit,
  register,
  inputName,
  onChecked,
}) => {
  const isSpinAgain = digit === "spin_again"; // Check if digit is "Spin again"
  const [isChecked, setChecked] = useState<boolean>(true);

  useEffect(() => {
    setChecked(isSpinAgain);
  }, [isSpinAgain]);

  const handleCheckedBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;
    setChecked(isChecked);
    onChecked(inputName, isChecked);
  };

  return (
    <div className="mt-10">
      <h2 className="text-4xl font-semibold">{title}</h2>
      <div className="flex flex-col my-5 w-full">
        <label className="label text-[#475467] text-xl">
          Discount percentage
        </label>
        <div className="flex gap-4 justify-center items-center">
          <input
            {...register(inputName)}
            defaultValue={isChecked ? "" : digit}
            type="number"
            className="input input-bordered xl:w-[500px]"
            disabled={isChecked}
          />
          <div>
            <input
              className="mr-2"
              type="checkbox"
              onChange={handleCheckedBox}
              checked={isChecked}
            />
            <span>Spin again</span>
          </div>
        </div>
      </div>
    </div>
  );
};
