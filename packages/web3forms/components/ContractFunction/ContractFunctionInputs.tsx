import { Grid } from "@mui/material";
import { Field } from "formik";
import { TextField } from "formik-mui";
import { ContractFormParams, FunctionInput } from "../../types";
import BooleanFormInput from "../BooleanFormInput";

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
  if (name && params.fields[name] && params.fields[name].hideInputs) {
    return null;
  }

  return (
    <>
      {inputs.map((input, key) => {
        if (input.type === "bool") {
          return (
            <Grid item xs={12} key={key}>
              <BooleanFormInput name={input.name} />
            </Grid>
          );
        }

        return (
          <Grid item xs={12} key={key}>
            <Field
              component={TextField}
              size="small"
              fullWidth
              label={
                name &&
                input.name &&
                params.fields[name].input &&
                params.fields[name].input[input.name] &&
                params.fields[name].input[input.name].label !== ""
                  ? params.fields[name].input[input.name].label
                  : input.name
              }
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
