import create from "./http-service";

export interface Spin {
  status: "on" | "off";
  digit_one: number | "spin_again";
  digit_two: number | "spin_again";
  digit_three: number | "spin_again";
  digit_four: number | "spin_again";
  digit_five: number | "spin_again";
  digit_six: number | "spin_again";
  digit_seven: number | "spin_again";
  digit_eight: number | "spin_again";
  digit_nine: number | "spin_again";
}

export default create("/spin/information");
