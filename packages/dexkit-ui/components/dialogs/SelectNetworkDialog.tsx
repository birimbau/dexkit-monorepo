import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { DexkitApiProvider } from "@dexkit/core/providers";
import { useWeb3React } from "@web3-react/core";
import { myAppsApi } from "../../constants/api";
import { useSwitchNetworkMutation } from "../../hooks";
import { AppDialogTitle } from "../AppDialogTitle";
import NetworkList from "../NetworkList";

interface Props {
  dialogProps: DialogProps;
}

function SwitchNetworkDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;

  const { chainId: connectorChainId } = useWeb3React();
  const [chainId, setChainId] = useState<number>();

  const switchNetworkMutation = useSwitchNetworkMutation();

  const handleClose = () => onClose!({}, "backdropClick");

  const handleSwitchNetwork = async () => {
    if (chainId !== undefined) {
      await switchNetworkMutation.mutateAsync({ chainId });
      handleClose();
    }
  };

  const handleSelectNetwork = (id: number) => {
    if (id === chainId) {
      return setChainId(undefined);
    }

    setChainId(id);
  };

  const handleReset = () => {
    switchNetworkMutation.reset();
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="switch.network"
            defaultMessage="Switch Network"
            description="Switch network dialog title"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        <Stack spacing={2}>
          {switchNetworkMutation.isError && (
            <Alert severity="error" onClose={handleReset}>
              {switchNetworkMutation.error?.message}
            </Alert>
          )}
          <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
            {/* TODO: remove this in the future */}

            <NetworkList
              chainId={chainId}
              onSelect={handleSelectNetwork}
              connectorChainId={connectorChainId}
            />
          </DexkitApiProvider.Provider>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          disabled={switchNetworkMutation.isLoading || chainId === undefined}
          startIcon={
            switchNetworkMutation.isLoading ? (
              <CircularProgress color="inherit" size="1rem" />
            ) : undefined
          }
          onClick={handleSwitchNetwork}
        >
          <FormattedMessage
            id="switch"
            defaultMessage="Switch"
            description="switch"
          />
        </Button>
        <Button
          disabled={switchNetworkMutation.isLoading}
          onClick={handleClose}
        >
          <FormattedMessage
            id="cancel"
            defaultMessage="Cancel"
            description="Cancel"
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SwitchNetworkDialog;
