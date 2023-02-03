import { InputBase, InputBaseProps } from "@mui/material";
import { BigNumber, ethers } from "ethers";

import { ChangeEvent, useCallback, useState } from "react";
import { useDebounceCallback } from "../../hooks";

interface Props {
  onChange: (value: BigNumber) => void;
  InputBaseProps?: InputBaseProps;
  value: BigNumber;
  decimals?: number;
}

export function CurrencyField({
  onChange,
  InputBaseProps,
  value,
  decimals,
}: Props) {
  const [internalValue, setIntervalValue] = useState({
    value: "",
    triggerChange: false,
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIntervalValue({ value: e.target.value, triggerChange: true });
    },
    [decimals]
  );

  useDebounceCallback<BigNumber>(
    value,
    (value) => {
      try {
        const val = ethers.utils.formatUnits(value, decimals);

        setIntervalValue({
          value: val,
          triggerChange: false,
        });
      } catch (err) {
        setIntervalValue({
          value: "",
          triggerChange: false,
        });
      }
    },
    500
  );

  useDebounceCallback<{ value: string; triggerChange: boolean }>(
    internalValue,
    (value) => {
      if (value.triggerChange) {
        onChange(ethers.utils.parseUnits(value.value, decimals));
      }
    },
    500
  );

  return (
    <InputBase
      {...InputBaseProps}
      inputProps={{ inputMode: "decimal" }}
      value={internalValue.value}
      onChange={handleChange}
    />
  );
}
