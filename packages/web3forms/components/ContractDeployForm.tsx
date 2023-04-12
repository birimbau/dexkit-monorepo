import { Box, Button } from "@mui/material";

import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useContractDeployMutation } from "../hooks";
import { AbiFragment, ContractDeployParams } from "../types";
import CallConfirmDialog from "./CallConfirmDialog";
import ContractConstructor from "./ContractConstructor";

export interface ContractDeployFormProps {
  abi: AbiFragment[];
  contractType: string;
  contractBytecode: string;
}

export default function ContractDeployForm({
  abi,
  contractType,
  contractBytecode,
}: ContractDeployFormProps) {
  const { provider } = useWeb3React();

  const [showConfirm, setShowConfirm] = useState(false);

  const contractDeployMutation = useContractDeployMutation({
    provider,
    contractBytecode,
    abi,
    onContractCreated: (contract: ethers.Contract) => {},
  });

  const [deployParams, setDeployParams] = useState<ContractDeployParams>();

  const handleCall = useCallback(async (params: ContractDeployParams) => {
    setDeployParams(params);
    setShowConfirm(true);
  }, []);

  const handleConfirm = async (value: BigNumber) => {
    if (deployParams) {
      setShowConfirm(false);
      await contractDeployMutation.mutateAsync({ params: deployParams, value });
      setDeployParams(undefined);
    }
  };

  const handleClose = () => {
    setShowConfirm(false);
    setDeployParams(undefined);
  };

  const renderForm = () => {
    const contractConstructor = abi?.find((i) => i.type === "constructor");

    if (contractConstructor) {
      return (
        <ContractConstructor
          inputs={contractConstructor.inputs}
          name={contractConstructor.name}
          stateMutability={contractConstructor.stateMutability}
          onCall={handleCall}
        />
      );
    }
    return (
      <Box>
        <Button
          onClick={() => handleCall({ args: [] })}
          variant="contained"
          color="primary"
        >
          <FormattedMessage id="deploy" defaultMessage="Deploy" />
        </Button>
      </Box>
    );
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
      {renderForm()}
    </Box>
  );
}
