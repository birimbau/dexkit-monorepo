import {
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Field, useFormikContext } from "formik";
import { Switch, TextField } from "formik-mui";
import { ContractFormParams, FunctionInput } from "../../types";

import ContactsIcon from "@mui/icons-material/Contacts";
import { useCallback, useState } from "react";
import SelectAddressDialog from "../SelectAddressDialog";

export interface ContractFunctionInputsProps {
  name?: string;
  params: ContractFormParams;
  inputs: FunctionInput[];
}

export default function ContractFunctionInputs({
  name,
  params,
  inputs,
}: ContractFunctionInputsProps) {
  const getInputParams = (input: FunctionInput) => {
    const inputParams =
      name &&
      input.name &&
      params.fields[name].input &&
      params.fields[name].input[input.name] &&
      params.fields[name].input[input.name]
        ? params.fields[name].input[input.name]
        : undefined;

    return inputParams;
  };

  if (name && params.fields[name] && params.fields[name].hideInputs) {
    return null;
  }

  const [showSelectAddress, setSelectedAddress] = useState(false);
  const [selectFor, setSelectFor] = useState<string>();
  const [selectAddresses, setSelectAddresses] = useState<string[]>();

  const { setFieldValue } = useFormikContext();

  const handleShowSelectAddress = (selectFor: string, addresses: string[]) => {
    setSelectedAddress(true);
    setSelectFor(selectFor);
    setSelectAddresses(addresses);
  };

  const handelCloseSelectAddress = () => {
    setSelectedAddress(false);
    setSelectFor(undefined);
    setSelectAddresses(undefined);
  };

  const handleSelect = useCallback((address: string) => {
    if (selectFor) {
      setFieldValue(selectFor, address);
      setSelectFor(undefined);
      setSelectedAddress(false);
    }
  }, []);

  return (
    <>
      {showSelectAddress && (
        <SelectAddressDialog
          DialogProps={{
            open: showSelectAddress,
            onClose: handelCloseSelectAddress,
          }}
          addresses={selectAddresses || []}
          onSelect={handleSelect}
        />
      )}

      {inputs.map((input, key) => {
        let inputParams = getInputParams(input);

        if (inputParams?.inputType === "address") {
          return (
            <Grid item xs={12} key={key}>
              <Field
                component={TextField}
                size="small"
                fullWidth
                label={inputParams.label ? inputParams.label : input.name}
                name={input.name}
                disabled={
                  name && params.fields[name]
                    ? params.fields[name].lockInputs
                    : undefined
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          handleShowSelectAddress(
                            input.name,
                            inputParams?.inputType === "address"
                              ? inputParams.addresses
                              : []
                          )
                        }
                        size="small"
                      >
                        <ContactsIcon fontSize="inherit" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          );
        } else if (inputParams?.inputType === "switch") {
          return (
            <Grid item xs={12} key={key}>
              <FormControlLabel
                label={inputParams.label ? inputParams.label : input.name}
                control={
                  <Field
                    component={Switch}
                    size="small"
                    fullWidth
                    name={input.name}
                    disabled={
                      name && params.fields[name]
                        ? params.fields[name].lockInputs
                        : undefined
                    }
                  />
                }
              />
            </Grid>
          );
        }

        return (
          <Grid item xs={12} key={key}>
            <Field
              component={TextField}
              size="small"
              fullWidth
              label={inputParams?.label ? inputParams.label : input.name}
              name={input.name}
              disabled={
                name && params.fields[name]
                  ? params.fields[name].lockInputs
                  : undefined
              }
            />
          </Grid>
        );
      })}
    </>
  );
}
