import { Box, Grid } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { useContractCallMutation } from "../hooks";
import ContractFunction from "./ContractFunction";

export interface Props {
  abi: {
    type: "function" | "constructor";
    name?: string;
    inputs: { type: string; name: string }[];
    stateMutability: string;
  }[];
  contractType: string;
  contractAddress: string;
}

export default function ContractForm({
  abi,
  contractType,
  contractAddress,
}: Props) {
  const { provider, connector } = useWeb3React();

  useEffect(() => {
    if (connector && typeof window !== "undefined") {
      connector.connectEagerly!();
    }
  }, [connector]);

  const contractCallMutation = useContractCallMutation({
    provider,
    contractAddress,
    abi,
  });

  const renderFields = () => {
    return abi.map((item, key) => {
      if (item.type === "constructor") {
        return (
          <Grid item xs={12} key={key}>
            <ContractFunction
              inputs={item.inputs}
              name={item.name}
              stateMutability={item.stateMutability}
              onCall={contractCallMutation.mutate}
            />
          </Grid>
        );
      } else if (item.type === "function") {
        return (
          <Grid item xs={12} key={key}>
            <ContractFunction
              inputs={item.inputs}
              name={item.name}
              stateMutability={item.stateMutability}
              onCall={contractCallMutation.mutate}
            />
          </Grid>
        );
      }
    }, {});
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {renderFields()}
      </Grid>
    </Box>
  );
}
