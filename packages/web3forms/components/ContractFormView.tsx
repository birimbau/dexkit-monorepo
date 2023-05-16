import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";

import { NETWORKS } from "@dexkit/core/constants/networks";
import { useSwitchNetworkMutation } from "@dexkit/ui/hooks";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { useCallOnMountFields, useContractCallMutation } from "../hooks";
import { CallParams, ContractFormParams } from "../types";

import CallConfirmDialog from "./CallConfirmDialog";
import ContractFormFunctions from "./ContractFormFunctions";
import ContractFunction from "./ContractFunction";

export interface Props {
  params: ContractFormParams;
}

export default function ContractFormView({ params }: Props) {
  const { abi, contractAddress, chainId: contractChainId } = params;
  const { provider, chainId } = useWeb3React();

  const [showConfirm, setShowConfirm] = useState(false);

  const rpcProvider = useMemo(() => {
    let network = NETWORKS[contractChainId];

    if (network) {
      return new ethers.providers.JsonRpcProvider(network.providerRpcUrl);
    }
  }, [contractChainId]);

  const [results, setResults] = useState<{ [key: string]: any }>({});

  let callOnMountQuery = useCallOnMountFields({
    contractAddress,
    abi,
    params,
    provider: rpcProvider,
    onSuccess: (results) => {
      setResults((res) => {
        return { ...res, ...results };
      });
    },
  });

  const contractCallMutation = useContractCallMutation({
    provider,
    contractAddress,
    abi,
    onSuccess: ({ name, result }: { name: string; result: any }) => {
      if (result.hash) {
        setResults((results) => {
          return { ...results, [name]: result.hash };
        });
      } else {
        setResults((results) => {
          return { ...results, [name]: result };
        });
      }
    },
  });

  const [callParams, setCallParams] = useState<CallParams>();

  const switchNetworkMutation = useSwitchNetworkMutation();

  const handleCall = useCallback(
    async (callParams: CallParams) => {
      if (params.chainId !== chainId && callParams && callParams.call) {
        await switchNetworkMutation.mutateAsync({ chainId: params.chainId });
      }

      setCallParams(callParams);

      if (callParams && callParams.call) {
        setShowConfirm(true);
      } else {
        await contractCallMutation.mutateAsync({ ...callParams });
      }

      await callOnMountQuery.refetch();
    },
    [chainId, params.chainId, callOnMountQuery]
  );

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
                params={params}
                chainId={chainId}
                results={results}
                isResultsLoading={callOnMountQuery.isFetching}
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
        <ContractFormFunctions
          abi={abi}
          onCall={handleCall}
          params={params}
          results={results}
          chainId={chainId}
          isCalling={contractCallMutation.isLoading}
          callFuncName={callParams?.name}
        />
      </Grid>
    </Box>
  );
}
