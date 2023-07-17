import {
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Field } from "formik";
import { Switch, TextField } from "formik-mui";
import { AbiFragmentInput, ContractFormParams } from "../../types";

import ContactsIcon from "@mui/icons-material/Contacts";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { validateDecimal } from "../../utils/validators";

export interface ContractFunctionProps {
  input: AbiFragmentInput;
  params: ContractFormParams;
  name?: string;
  objectName?: string;
  onSelectAddress: (name: string, addresses: string[]) => void;
}

export default function ContractFunctionInput({
  name,
  input,
  params,
  objectName,
  onSelectAddress,
}: ContractFunctionProps) {
  const { formatMessage } = useIntl();

  const inputParams = useMemo(() => {
    const inputParams =
      name &&
      input.name &&
      params.fields[name] &&
      params.fields[name].input &&
      params.fields[name].input[input.name] &&
      params.fields[name].input[input.name]
        ? params.fields[name].input[input.name]
        : undefined;

    return inputParams;
  }, [name, params, input]);

  if (inputParams?.inputType === "address") {
    return (
      <Grid item xs={12}>
        <Field
          component={TextField}
          size="small"
          fullWidth
          label={inputParams.label ? inputParams.label : input.name}
          name={objectName ? `${objectName}.${input.name}` : input.name}
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
                    onSelectAddress(
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
      <Grid item xs={12}>
        <FormControlLabel
          label={inputParams.label ? inputParams.label : input.name}
          control={
            <Field
              component={Switch}
              size="small"
              type="checkbox"
              fullWidth
              name={objectName ? `${objectName}.${input.name}` : input.name}
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
    <Grid item xs={12}>
      <Field
        component={TextField}
        size="small"
        fullWidth
        label={inputParams?.label ? inputParams.label : input.name}
        name={objectName ? `${objectName}.${input.name}` : input.name}
        disabled={
          name && params.fields[name]
            ? params.fields[name].lockInputs
            : undefined
        }
        validate={
          inputParams?.inputType === "decimal"
            ? validateDecimal(
                formatMessage({
                  id: "invalid.decimal",
                  defaultMessage: "Invalid decimal",
                })
              )
            : undefined
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {input.type.toUpperCase()}
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
}
