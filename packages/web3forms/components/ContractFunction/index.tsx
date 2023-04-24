import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { FormattedMessage } from "react-intl";

import { Formik } from "formik";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import { CallParams, ContractFormParams, FunctionInput } from "../../types";
import { getSchemaForInputs } from "../../utils";

import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { getBlockExplorerUrl } from "@dexkit/core/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ethers } from "ethers";
import ContractFunctionInputs from "./ContractFunctionInputs";

export function isFunctionCall(stateMutability: string) {
  return stateMutability === "nonpayable" || stateMutability === "payable";
}

export interface ContractFieldProps {
  inputs: FunctionInput[];
  params: ContractFormParams;
  name?: string;
  stateMutability: string;
  isCalling?: boolean;
  chainId?: ChainId;
  results?: { [key: string]: any };
  onCall: ({ name, args, call, payable }: CallParams) => void;
}

export default function ContractFunction({
  inputs,
  name,
  stateMutability,
  chainId,
  isCalling,
  params,
  results,
  onCall,
}: ContractFieldProps) {
  const getInitialValues = useCallback(
    (inputs: FunctionInput[], params: ContractFormParams) => {
      let obj: { [key: string]: string } = {};

      for (let input of inputs) {
        if (name && input.name && params.fields[name].input) {
          const inp = params.fields[name].input[input.name];

          const defaultValue = inp ? inp.defaultValue : "";

          obj[input.name] = defaultValue;
        }
      }

      return obj;
    },
    []
  );

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

  const submitMessage = useMemo(() => {
    if (
      (stateMutability === "nonpayable" || stateMutability === "payable") &&
      params.chainId !== chainId
    ) {
      return (
        <FormattedMessage
          id="switch.to.network"
          defaultMessage="Switch to {network}"
          values={{
            network:
              params.chainId && NETWORKS[params.chainId]
                ? NETWORKS[params.chainId].name
                : "unknown",
          }}
        />
      );
    }

    if (isCalling) {
      if (stateMutability === "nonpayable" || stateMutability === "payable") {
        return <FormattedMessage id="calling" defaultMessage="Calling" />;
      } else if (stateMutability === "view") {
        return <FormattedMessage id="loading" defaultMessage="Loading" />;
      }
    } else if (stateMutability === "view") {
      return <FormattedMessage id="get" defaultMessage="Get" />;
    } else {
      if (name && params.fields[name].callToAction) {
        return params.fields[name].callToAction;
      }
      return <FormattedMessage id="call" defaultMessage="Call" />;
    }
  }, [stateMutability, name, params]);

  const result = useMemo(() => {
    if (name && results && results[name]) {
      let value = results[name];

      if (value instanceof ethers.BigNumber) {
        return value.toString();
      }

      return String(value);
    }
  }, [results, name]);

  const fieldName = useMemo(() => {
    return name && params.fields[name] && params.fields[name].name
      ? params.fields[name].name
      : name;
  }, [name, params]);

  if (
    name &&
    params.fields[name] !== undefined &&
    params.fields[name].callOnMount
  ) {
    return (
      <Card>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {fieldName}
            {result && <>: {result}</>}
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Formik
      initialValues={getInitialValues(inputs, params)}
      onSubmit={handleSubmit}
      validationSchema={getSchemaForInputs(inputs)}
    >
      {({ submitForm, isValid }) => (
        <Accordion
          defaultExpanded={
            name && params.fields[name]
              ? params.fields[name].collapse
              : undefined
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {fieldName}
              {result && <>: {result}</>}
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Grid container spacing={2}>
              <ContractFunctionInputs
                name={name}
                inputs={inputs}
                params={params}
              />
              <Grid item xs={12}>
                <Stack spacing={1} direction="row">
                  {name &&
                    params.fields[name] &&
                    !params.fields[name].callOnMount && (
                      <Button
                        size="small"
                        disabled={!isValid || isCalling}
                        onClick={submitForm}
                        startIcon={
                          isCalling && (
                            <CircularProgress size="1rem" color="inherit" />
                          )
                        }
                        variant="contained"
                      >
                        {submitMessage}
                      </Button>
                    )}

                  {(stateMutability === "nonpayable" ||
                    stateMutability === "payable") &&
                    name &&
                    results &&
                    results[name] && (
                      <Button
                        LinkComponent="a"
                        href={`${getBlockExplorerUrl(chainId)}/tx/${
                          results[name]
                        }`}
                        target="_blank"
                        size="small"
                        variant="outlined"
                      >
                        <FormattedMessage
                          id="view.transaction"
                          defaultMessage="View Transaction"
                        />
                      </Button>
                    )}
                </Stack>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Formik>
  );
}
