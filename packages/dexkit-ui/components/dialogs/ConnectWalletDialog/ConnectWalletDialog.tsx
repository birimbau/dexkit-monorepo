import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  List,
  Stack,
  TextField,
} from "@mui/material";

import { ChangeEvent, useState } from "react";

import { FormattedMessage, useIntl } from "react-intl";

import { useSnackbar } from "notistack";

import { AppDialogTitle } from "../../AppDialogTitle";

import { createWallet } from "thirdweb/wallets";

import Wallet from "@mui/icons-material/Wallet";
import { createThirdwebClient } from "thirdweb";
import { THIRDWEB_CLIENT_ID } from "../../../constants/thirdweb";
import { WalletSelector } from "./WalletSelector";

import { useConnect } from "thirdweb/react";

export interface ConnectWalletDialogProps {
  DialogProps: DialogProps;
}

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

export default function ConnectWalletDialog({
  DialogProps: dialogProps,
}: ConnectWalletDialogProps) {
  const { onClose } = dialogProps;

  const { formatMessage } = useIntl();

  const { connect, isConnecting, error } = useConnect();

  const [connectorName, setConnectorName] = useState<string>();

  const handleClose = () => {
    onClose!({}, "backdropClick");
  };

  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");

  const handleConnectWithEmail = () => {
    setEmail("");
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail((e.target as any).value);
  };

  /* const renderConnectors = () => {
    return wallets.map((conn: Wallet, index: number) => (
      <>
        {conn.id.shouldDisplay() && (
          <ListItemButton
            divider
            key={index}
            disabled={isActivating && connectorName === conn.id}
            onClick={() =>
              handleActivateWallet({
                connectorName: conn.id,
                loginType: conn?.loginType,

                icon: conn?.icon,
                name: conn?.name,
                overrideActivate: conn?.overrideActivate,
              })
            }
          >
            <ListItemAvatar>
              <Avatar>
                <Avatar
                  sx={(theme) => ({
                    background: lighten(theme.palette.background.default, 0.05),
                    padding: theme.spacing(1),
                    width: "auto",
                    height: theme.spacing(5),
                  })}
                  src={conn.icon}
                  alt={conn.name}
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={conn.name} />
            {isActivating && connectorName === conn.id && (
              <CircularProgress
                color="primary"
                sx={{ fontSize: (theme) => theme.spacing(2) }}
              />
            )}
            {isActive &&
              activeConnectorName === conn.id &&
              (activeConnectorName === "magic" ? (
                conn?.loginType === "test" ? (
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                  >
                    <FiberManualRecordIcon
                      sx={{ color: (theme) => theme.palette.success.light }}
                    />
                  </Stack>
                ) : null
              ) : (
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  alignContent="center"
                >
                  <FiberManualRecordIcon
                    sx={{ color: (theme) => theme.palette.success.light }}
                  />
                </Stack>
              ))}
          </ListItemButton>
        )}
      </>
    ));
  };*/

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        icon={<Wallet />}
        title={
          <FormattedMessage
            id="connect.your.wallet"
            defaultMessage="Connect Your Wallet"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ padding: 0 }}>
        <Box p={2}>
          <Stack spacing={2}>
            <TextField
              disabled={isConnecting && connectorName === "magic"}
              value={email}
              onChange={handleChangeEmail}
              type="email"
              placeholder={formatMessage({
                id: "email",
                defaultMessage: "Email",
              })}
            />
            <Button
              disabled={isConnecting && connectorName === "magic"}
              startIcon={
                isConnecting &&
                connectorName === "magic" && (
                  <CircularProgress
                    color="primary"
                    sx={{ fontSize: (theme) => theme.spacing(2) }}
                  />
                )
              }
              onClick={handleConnectWithEmail}
              variant="contained"
            >
              <FormattedMessage
                id="connect.with.email"
                defaultMessage="Connect with e-mail"
              />
            </Button>
          </Stack>
        </Box>
        <Divider />
        <List disablePadding>
          <WalletSelector client={client} wallets={wallets}></WalletSelector>
        </List>
      </DialogContent>
    </Dialog>
  );
}
