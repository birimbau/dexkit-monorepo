import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  lighten,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";

import { ChangeEvent, useState } from "react";

import { FormattedMessage, useIntl } from "react-intl";

import { useSnackbar } from "notistack";

import { AppDialogTitle } from "../AppDialogTitle";

import { magic } from "@dexkit/wallet-connectors/connectors/connections";
import { MagicLoginType } from "@dexkit/wallet-connectors/connectors/magic";
import { EMAIL_ICON } from "@dexkit/wallet-connectors/constants/icons";
import { useOrderedConnections } from "@dexkit/wallet-connectors/hooks/useOrderedConnections";
import { WalletActivateParams } from "@dexkit/wallet-connectors/types";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Wallet from "@mui/icons-material/Wallet";

export interface ConnectWalletDialogProps {
  DialogProps: DialogProps;
  activate: (params: WalletActivateParams) => Promise<void>;
  isActivating: boolean;
  isActive: boolean;
  activeConnectorName?: string;
  magicRedirectUrl?: string;
}

export default function ConnectWalletDialog({
  DialogProps: dialogProps,
  activate,
  isActivating,
  isActive,
  activeConnectorName,
}: ConnectWalletDialogProps) {
  const { orderedConnections } = useOrderedConnections();
  const { onClose } = dialogProps;

  const { formatMessage } = useIntl();

  const [connectorName, setConnectorName] = useState<string>();
  const [loginType, setLoginType] = useState<MagicLoginType | undefined>(
    localStorage.getItem("loginType") as MagicLoginType
  );

  const handleClose = () => {
    onClose!({}, "backdropClick");
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleActivateWallet = async ({
    connector,
    loginType,
    email,
    icon,
    name,
    connectorName,
    rdns,
    connectionType,
    overrideActivate,
  }: WalletActivateParams) => {
    setConnectorName(connectorName);
    setLoginType(loginType);

    try {
      if (loginType) {
        await activate({
          connectorName,
          email,
          loginType,
          connector,
          rdns,
          connectionType,
          icon,
          name,
        });
      } else {
        await activate({
          connectorName,
          connector,
          icon,
          rdns,
          connectionType,
          name,
          overrideActivate,
        });
      }
    } catch (err: any) {
      enqueueSnackbar(err.message, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      setConnectorName(undefined);
    }
    handleClose();
  };

  const [email, setEmail] = useState("");

  const handleConnectWithEmail = () => {
    handleActivateWallet({
      connectorName: "magic",
      name: "Email",
      icon: EMAIL_ICON,
      loginType: "email",
      email: email,
      connector: magic,
    });
    setEmail("");
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail((e.target as any).value);
  };

  const renderConnectors = () => {
    return orderedConnections.map(({ connection: conn }, index: number) => (
      <>
        {conn.shouldDisplay() && (
          <ListItemButton
            divider
            key={index}
            disabled={
              isActivating && connectorName === conn.getProviderInfo().name
            }
            onClick={() => {
              handleActivateWallet({
                connectorName: conn.getProviderInfo().name,
                connector: conn.connector,
                loginType: conn?.loginType,
                rdns: conn.getProviderInfo().rdns,
                connectionType: conn?.type,
                icon: conn?.getProviderInfo().icon,
                name: conn?.getProviderInfo().name,
                overrideActivate: conn?.overrideActivate,
              });
            }}
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
                  src={conn?.getProviderInfo().icon}
                  alt={conn?.getProviderInfo().name}
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={conn?.getProviderInfo().name} />
            {isActivating &&
              connectorName === conn?.getProviderInfo().name &&
              conn?.loginType === loginType && (
                <CircularProgress
                  color="primary"
                  sx={{ fontSize: (theme) => theme.spacing(2) }}
                />
              )}
            {isActive &&
              activeConnectorName === conn?.getProviderInfo().name && (
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
              )}
          </ListItemButton>
        )}
      </>
    ));
  };

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
              disabled={
                isActivating &&
                connectorName === "magic" &&
                loginType === "email"
              }
              value={email}
              onChange={handleChangeEmail}
              type="email"
              placeholder={formatMessage({
                id: "email",
                defaultMessage: "Email",
              })}
            />
            <Button
              disabled={
                isActivating &&
                connectorName === "magic" &&
                loginType === "email"
              }
              startIcon={
                isActivating &&
                connectorName === "magic" &&
                loginType === "email"
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
        <List disablePadding>{renderConnectors()}</List>
      </DialogContent>
    </Dialog>
  );
}
