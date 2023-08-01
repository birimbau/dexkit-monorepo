import { TextField, TextFieldProps } from "@mui/material";
import { ChangeEvent } from "react";

export interface DecimalInputProps {
  value: string;
  onChange: (value: string) => void;
  TextFieldProps?: TextFieldProps;
}

const patternTwoDigisAfterComma = /^\d+(\.\d{0,18})?$/;

export default function DecimalInput({
  value,
  onChange,
  TextFieldProps,
}: DecimalInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (
      patternTwoDigisAfterComma.test(e.target.value) ||
      e.target.value === ""
    ) {
      onChange(e.target.value);
    }
  };

  return (
    <TextField
      {...TextFieldProps}
      value={value}
      fullWidth
      onChange={handleChange}
    />
  );
}
