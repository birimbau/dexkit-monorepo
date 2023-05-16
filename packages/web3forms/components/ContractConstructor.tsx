import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { FormattedMessage } from "react-intl";

import { Field, Formik } from "formik";

import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { parseChainId } from "@dexkit/core/utils";
import {
  Avatar,
  CircularProgress,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { TextField } from "formik-mui";
import { useSnackbar } from "notistack";
import { ReactNode, useCallback, useState } from "react";
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
  onSwitchNetwork?: (chainId?: ChainId) => Promise<void>;
  chainId?: ChainId;
  isLoading?: boolean;
}

export default function ContractConstructor({
  isLoading,
  inputs,
  name,
  stateMutability,
  onCall,
  chainId,
  onSwitchNetwork,
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

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = useCallback(
    async (values: any) => {
      try {
        onCall({
          name: !name ? "constructor" : name,
          args: Object.keys(values).map((key) => values[key]),
          call: isFunctionCall(stateMutability),
          payable: stateMutability === "payable",
        });
      } catch (err) {
        enqueueSnackbar(String(err), { variant: "error" });
      }
    },
    [name, stateMutability, onCall]
  );

  const [selectedChainId, setSelectedChainId] = useState<ChainId>(
    chainId ? chainId : ChainId.Ethereum
  );

  const handleChangeChainId = (
    event: SelectChangeEvent<number>,
    child: ReactNode
  ) => {
    setSelectedChainId(parseChainId(event.target.value));
  };

  const handleSubmitClick = useCallback(
    (submitForm: () => void) => {
      if (chainId !== selectedChainId) {
        return async () => {
          if (onSwitchNetwork) {
            await onSwitchNetwork(selectedChainId);
            submitForm();
          }
        };
      }

      return () => {
        submitForm();
      };
    },
    [chainId, selectedChainId]
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
            <Grid item xs={12}>
              <Select
                renderValue={(value) => {
                  return (
                    <Stack
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      spacing={1}
                    >
                      <Avatar
                        src={NETWORKS[selectedChainId].imageUrl || ""}
                        style={{ width: "auto", height: "1rem" }}
                      />
                      <Typography variant="body1">
                        {NETWORKS[selectedChainId].name}
                      </Typography>
                    </Stack>
                  );
                }}
                fullWidth
                value={chainId}
                onChange={handleChangeChainId}
              >
                {Object.keys(NETWORKS)
                  .map((key) => NETWORKS[parseChainId(key)])
                  .filter((n) => {
                    return !(
                      n.testnet && process.env.NODE_ENV === "production"
                    );
                  })
                  .map((network) => (
                    <MenuItem
                      value={network.chainId.toString()}
                      key={network.chainId}
                    >
                      <Box mr={2}>
                        <Avatar
                          src={network.imageUrl}
                          sx={{ width: "1.5rem", height: "1.5rem" }}
                        />
                      </Box>
                      <ListItemText primary={network.name} />
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
            {renderInputs()}
            <Grid item xs={12}>
              <Button
                startIcon={
                  isLoading && <CircularProgress color="inherit" size="1rem" />
                }
                disabled={!isValid || isLoading}
                onClick={handleSubmitClick(submitForm)}
                variant="contained"
              >
                {chainId !== selectedChainId ? (
                  <FormattedMessage
                    id="switch.network"
                    defaultMessage="Switch Network"
                  />
                ) : (
                  <FormattedMessage id="deploy" defaultMessage="Deploy" />
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Formik>
  );
}
