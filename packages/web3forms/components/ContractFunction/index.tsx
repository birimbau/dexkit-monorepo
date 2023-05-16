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
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import { CallParams, ContractFormParams, FunctionInput } from "../../types";
import { getSchemaForInputs } from "../../utils";

import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { getBlockExplorerUrl, parseChainId } from "@dexkit/core/utils";
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
  isResultsLoading?: boolean;
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
  isResultsLoading,
  onCall,
}: ContractFieldProps) {
  const getInitialValues = useCallback(
    (inputs: FunctionInput[], params: ContractFormParams) => {
      let obj: { [key: string]: string } = {};

      for (let input of inputs) {
        if (name && input.name && params.fields[name].input) {
          const inp = params.fields[name].input[input.name];

          let defaultValue: any;

          if (inp.inputType === "normal" || inp.inputType === "address") {
            defaultValue = inp ? inp.defaultValue : "";
          } else if (inp.inputType === "switch") {
            defaultValue = inp ? Boolean(inp.defaultValue) : false;
          }

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
    const paramsChainId = parseChainId(params.chainId);

    if (
      (stateMutability === "nonpayable" || stateMutability === "payable") &&
      paramsChainId !== chainId
    ) {
      return (
        <FormattedMessage
          id="switch.to.network"
          defaultMessage="Switch to {network}"
          values={{
            network:
              paramsChainId && NETWORKS[paramsChainId]
                ? NETWORKS[paramsChainId].name
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
  }, [stateMutability, name, params, chainId]);

  const result = useMemo(() => {
    if (stateMutability !== "view") {
      return "";
    }

    if (name && results && results[name]) {
      let value = results[name];

      if (value instanceof ethers.BigNumber) {
        return value.toString();
      }

      return String(value);
    }
  }, [results, name, stateMutability]);

  const fieldName = useMemo(() => {
    return name && params.fields[name] && params.fields[name].name
      ? params.fields[name].name
      : name;
  }, [name, params]);

  const hideLabel: boolean = useMemo(() => {
    if (
      name &&
      params.fields[name] &&
      params.fields[name].hideLabel !== undefined
    ) {
      return params.fields[name].hideLabel;
    }

    return false;
  }, [params.fields]);

  const callOnMount =
    name && params.fields[name] && params.fields[name].callOnMount;

  const collapse =
    name && params.fields[name] ? params.fields[name].collapse : undefined;

  if (callOnMount) {
    return (
      <Card>
        <Box sx={{ p: 2 }}>
          {!hideLabel ? (
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {fieldName}
              {result && <>: {result}</>}
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {result}
            </Typography>
          )}
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
      {({ submitForm, isValid, values, errors }) => (
        <Accordion key={String(collapse)} defaultExpanded={collapse}>
          {!hideLabel && (
            <>
              <AccordionSummary
                expandIcon={!collapse ? <ExpandMoreIcon /> : undefined}
                sx={{ width: "100%" }}
              >
                {isResultsLoading ? (
                  <Skeleton sx={{ width: "100%" }} />
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {fieldName}
                    {result && <>: {result}</>}
                  </Typography>
                )}
              </AccordionSummary>
              <Divider />
            </>
          )}
          <AccordionDetails sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <ContractFunctionInputs
                name={name}
                inputs={inputs}
                params={params}
              />
              <Grid item xs={12}>
                <Box>
                  <Stack spacing={1} direction="row">
                    {!callOnMount && (
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
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Formik>
  );
}
