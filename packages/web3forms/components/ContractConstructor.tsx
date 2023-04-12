import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { FormattedMessage } from "react-intl";

import { Field, Formik } from "formik";

import { TextField } from "formik-mui";
import { useCallback } from "react";
import { CallParams, FunctionInput } from "../types";
import { getSchemaForInputs } from "../utils";

export function isFunctionCall(stateMutability: string) {
  return stateMutability === "nonpayable" || stateMutability === "payable";
}

export interface ContractConstructorProps {
  inputs: FunctionInput[];
  name?: string;
  stateMutability: string;
  onCall: ({ name, args, call, payable }: CallParams) => void;
}

export default function ContractConstructor({
  inputs,
  name,
  stateMutability,
  onCall,
}: ContractConstructorProps) {
  const renderInputs = () => {
    return inputs.map((input, key) => {
      return (
        <Grid item xs={12} key={key}>
          <Field
            component={TextField}
            size="small"
            fullWidth
            label={input.name}
            name={input.name}
          />
        </Grid>
      );
    });
  };

  const getInitialValues = useCallback((inputs: FunctionInput[]) => {
    let obj: { [key: string]: string } = {};

    for (let input of inputs) {
      obj[input.name] = "";
    }

    return obj;
  }, []);

  const handleSubmit = useCallback(
    async (values: any) => {
      onCall({
        name: !name ? "constructor" : name,
        args: Object.keys(values).map((key) => values[key]),
        call: isFunctionCall(stateMutability),
        payable: stateMutability === "payable",
      });
    },
    [name, stateMutability, onCall]
  );

  return (
    <Formik
      initialValues={getInitialValues(inputs)}
      onSubmit={handleSubmit}
      validationSchema={getSchemaForInputs(inputs)}
    >
      {({ submitForm, isValid }) => (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">{name}</Typography>
            </Grid>
            {renderInputs()}
            <Grid item xs={12}>
              <Button
                disabled={!isValid}
                onClick={submitForm}
                variant="contained"
              >
                <FormattedMessage id="call" defaultMessage="Call" />
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Formik>
  );
}
