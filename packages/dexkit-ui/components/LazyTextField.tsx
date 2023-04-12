import { useDebounce } from "@dexkit/core/hooks/misc";

import { TextField, TextFieldProps } from "@mui/material";

import { ChangeEvent, useCallback, useEffect, useState } from "react";

interface LazyTextFieldProps {
  onChange: (value: string) => void;
  TextFieldProps?: TextFieldProps;
}

export default function LazyTextField({
  onChange,
  TextFieldProps,
}: LazyTextFieldProps) {
  const [value, setValue] = useState("");

  const lazyString = useDebounce<string>(value, 500);

  useEffect(() => {
    onChange(lazyString);
  }, [lazyString]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <TextField {...TextFieldProps} value={value} onChange={handleChange} />
  );
}
