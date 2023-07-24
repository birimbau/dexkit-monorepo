import { isAddress } from "ethers/lib/utils";
import { PATTERN_TWO_DIGITS_AFTER_COMMA } from "../constants/validation";

export function validateDecimal(message: string) {
  return (value: string) => {
    if (!PATTERN_TWO_DIGITS_AFTER_COMMA.test(value)) {
      return message;
    }
  };
}

export function validateAddress(message: string) {
  return (value: string) => {
    if (isAddress(value)) {
      return message;
    }
  };
}
