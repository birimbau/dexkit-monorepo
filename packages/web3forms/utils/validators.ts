import { PATTERN_TWO_DIGITS_AFTER_COMMA } from "../constants/validation";

export function validateDecimal(message: string) {
  return (value: string) => {
    if (!PATTERN_TWO_DIGITS_AFTER_COMMA.test(value)) {
      return message;
    }
  };
}
