import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Wallet from "@mui/icons-material/Wallet";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useConnectWalletDialog } from "../hooks";

interface Props {
  subHeaderMsg?: React.ReactNode | string;
}

export function ConnectWalletBox({ subHeaderMsg }: Props) {
  const connectWalletDialog = useConnectWalletDialog();

  return (
    <Box py={4}>
      <Stack
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        spacing={2}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          alignContent="center"
        >
          <Typography variant="h5">
            <FormattedMessage
              id="no.wallet.connected"
              defaultMessage="No Wallet connected"
            />
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {subHeaderMsg ? (
              subHeaderMsg
            ) : (
              <FormattedMessage
                id="connect.wallet.to.see.apps.associated.with.your.account"
                defaultMessage="Connect wallet to see apps associated with your account"
              />
            )}
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => connectWalletDialog.setOpen(true)}
          startIcon={<Wallet />}
          endIcon={<ChevronRightIcon />}
        >
          <FormattedMessage
            id="connect.wallet"
            defaultMessage="Connect Wallet"
            description="Connect wallet button"
          />
        </Button>
      </Stack>
    </Box>
  );
}
