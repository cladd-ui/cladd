import { ButtonSize } from "../components/Button";
import { InputSize } from "../components/Input";
import { NumberFieldSize } from "../components/NumberField";
import { TextAreaSize } from "../components/TextArea";

export const roundedClasses = (
  size: ButtonSize | InputSize | TextAreaSize | NumberFieldSize,
  rounded?: boolean,
  multiline?: boolean,
) => {
  const itemRoundedClasses =
    rounded && multiline
      ? {
          sm: "rounded-[12px]",
          md: "rounded-[14px]",
          lg: "rounded-[16px]",
          xl: "rounded-[20px]",
          "2xl": "rounded-[24px]",
        }[size]
      : rounded
        ? "rounded-full"
        : {
            sm: "rounded-md", // 6
            md: "rounded-lg", // 8
            lg: "rounded-[10px]", // 10
            xl: "rounded-xl", // 12
            "2xl": "rounded-2xl", // 16
          }[size];
  const focusRoundedClasses =
    rounded && multiline
      ? {
          sm: "rounded-[18px]",
          md: "rounded-[20px]",
          lg: "rounded-[22px]",
          xl: "rounded-[26px]",
          "2xl": "rounded-[30px]",
        }[size]
      : rounded
        ? "rounded-full"
        : {
            sm: "rounded-[12px]",
            md: "rounded-[14px]",
            lg: "rounded-[16px]",
            xl: "rounded-[18px]",
            "2xl": "rounded-[22px]",
          }[size];
  const wrapRoundedClasses =
    rounded && multiline
      ? {
          sm: "rounded-[16px]",
          md: "rounded-[18px]",
          lg: "rounded-[20px]",
          xl: "rounded-[24px]",
          "2xl": "rounded-[28px]",
        }[size]
      : rounded
        ? "rounded-full"
        : {
            sm: "rounded-[10px]",
            md: "rounded-[12px]",
            lg: "rounded-[14px]",
            xl: "rounded-[16px]",
            "2xl": "rounded-[18px]",
          }[size];
  return { itemRoundedClasses, focusRoundedClasses, wrapRoundedClasses };
};
