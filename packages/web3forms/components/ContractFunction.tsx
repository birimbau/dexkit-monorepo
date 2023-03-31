import { Box, Button, Grid, TextField, Typography } from "@mui/material";

import { FormattedMessage } from "react-intl";

export function isFunctionCall(stateMutability: string) {
  return stateMutability === "nonpayable" || stateMutability === "payable";
}

export interface ContractFieldProps {
  inputs: { type: string; name: string }[];
  name?: string;
  stateMutability: string;
  onCall: ({
    name,
    args,
    call,
  }: {
    name: string;
    args: any[];
    call: boolean;
  }) => void;
}

export default function ContractFunction({
  inputs,
  name,
  stateMutability,
  onCall,
}: ContractFieldProps) {
  const renderInputs = () => {
    return inputs.map((input, key) => {
      return (
        <Grid item xs={12} key={key}>
          <TextField size="small" label={input.name} />
        </Grid>
      );
    });
  };

  const mapInputs = () => {
    const mappedInputs = inputs.map((input) => {
      input.name;
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1">{name}</Typography>
        </Grid>
        {renderInputs()}
        <Grid item xs={12}>
          <Button
            onClick={() =>
              onCall({
                name: !name ? "constructor" : name,
                args: [],
                call: isFunctionCall(stateMutability),
              })
            }
            variant="contained"
          >
            <FormattedMessage id="call" defaultMessage="Call" />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
