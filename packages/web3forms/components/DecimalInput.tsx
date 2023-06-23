import { Field } from "formik";
import { TextField } from "formik-mui";

function validateDecimal(message: string, decimals: number) {
  return (value: string) => {
    const patternTwoDigisAfterComma = `^\\d+(\\.\\d{0,${decimals}})?$`;

    if (!new RegExp(patternTwoDigisAfterComma, "i").test(value)) {
      return message;
    }
  };
}

export interface DecimalInputProps {
  decimals: number;
  name: string;
  label: string;
}

export default function DecimalInput({
  decimals,
  name,
  label,
}: DecimalInputProps) {
  return (
    <Field
      component={TextField}
      name={name}
      size="small"
      fullWidth
      label={label}
      validate={validateDecimal("invalid decimal", decimals)}
    />
  );
}
