import { TextFieldProps } from "@mui/material";
import { useField } from "formik";
import DecimalInput from "./DecimalInput";

export interface FormikDecimalInputProps {
  TextFieldProps?: TextFieldProps;
  decimals?: number;
  name: string;
}

export default function FormikDecimalInput({
  TextFieldProps,
  decimals,
  name,
}: FormikDecimalInputProps) {
  const [field, meta, helpers] = useField(name);

  const handleChange = (value: string) => {
    helpers.setValue(value);
  };

  return (
    <DecimalInput
      onChange={handleChange}
      value={field.value}
      TextFieldProps={TextFieldProps}
      decimals={decimals}
    />
  );
}
