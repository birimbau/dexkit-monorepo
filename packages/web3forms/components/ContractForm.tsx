import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";

import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useCallback, useState } from "react";
import { useContractCallMutation } from "../hooks";
import { CallParams, ContractFormParams } from "../types";
import CallConfirmDialog from "./CallConfirmDialog";
import ContractFunction from "./ContractFunction";

export interface Props {
  params: ContractFormParams;
}

export default function ContractForm({ params }: Props) {
  const { abi, contractAddress } = params;
  const { provider } = useWeb3React();

  const [showConfirm, setShowConfirm] = useState(false);

  const contractCallMutation = useContractCallMutation({
    provider,
    contractAddress,
    abi,
  });

  const [callParams, setCallParams] = useState<CallParams>();

  const handleCall = useCallback(async (params: CallParams) => {
    setCallParams(params);

    if (params && params.call) {
      setShowConfirm(true);
    } else {
      await contractCallMutation.mutateAsync({ ...params });
    }
  }, []);

  const handleConfirm = useCallback(
    async (value: BigNumber) => {
      if (callParams && callParams.call) {
        setShowConfirm(false);
        await contractCallMutation.mutateAsync({ ...callParams, value });
      }
    },
    [callParams]
  );

  const handleClose = () => {
    setShowConfirm(false);
    setCallParams(undefined);
  };

  const renderFields = () => {
    return abi
      .filter((i) => i.type === "function")
      .filter((i) => {
        if (i.name) {
          let field = params.fields[i.name];

          if (field) {
            return field.visible;
          }
        }

        return false;
      })
      .map((item, key) => {
        if (item.type === "function") {
          return (
            <Grid item xs={12} key={key}>
              <ContractFunction
                inputs={item.inputs}
                name={item.name}
                stateMutability={item.stateMutability}
                onCall={handleCall}
                isCalling={
                  contractCallMutation.isLoading &&
                  callParams?.name === item.name
                }
              />
            </Grid>
          );
        }
      });
  };

  return (
    <Box>
      <CallConfirmDialog
        DialogProps={{
          open: showConfirm,
          onClose: handleClose,
          fullWidth: true,
          maxWidth: "sm",
        }}
        onConfirm={handleConfirm}
      />
      <Grid container spacing={1}>
        {renderFields()}
      </Grid>
    </Box>
  );
}
