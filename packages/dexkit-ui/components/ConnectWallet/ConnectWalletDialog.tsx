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

import { WALLET_CONNECTORS } from "@dexkit/wallet-connectors/connectors";
import { magic } from "@dexkit/wallet-connectors/connectors/connections";
import { MagicLoginType } from "@dexkit/wallet-connectors/connectors/magic";
import { EMAIL_ICON } from "@dexkit/wallet-connectors/constants/icons";
import { WalletActivateParams } from "@dexkit/wallet-connectors/types";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Wallet from "@mui/icons-material/Wallet";
import { Connector } from "@web3-react/types";

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
  const { onClose } = dialogProps;

  const { formatMessage } = useIntl();

  const [connectorName, setConnectorName] = useState<string>();
  const [loginType, setLoginType] = useState<MagicLoginType | undefined>(
    localStorage.getItem("loginType") as MagicLoginType
  );

  const handelClose = () => {
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
    overrideActivate,
  }: {
    connectorName: WalletActivateParams["connectorName"];
    name?: string;
    icon?: string;
    loginType?: MagicLoginType;
    email?: string;
    connector: Connector;
    overrideActivate?: (chainId?: number) => boolean;
  }) => {
    setConnectorName(connectorName);
    setLoginType(loginType);

    try {
      if (connectorName === "magic") {
        await activate({
          connectorName,
          email,
          loginType,
          connector,
          icon,
          name,
        });
      } else {
        await activate({
          connectorName,
          connector,
          icon,
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
    handelClose();
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
    return WALLET_CONNECTORS.map((conn, index: number) => (
      <>
        {conn.shouldDisplay() && (
          <ListItemButton
            divider
            key={index}
            disabled={
              isActivating &&
              connectorName === conn.id &&
              conn?.loginType === loginType
            }
            onClick={() =>
              handleActivateWallet({
                connectorName: conn.id,
                loginType: conn?.loginType,
                connector: conn.connector,
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
            {isActivating &&
              connectorName === conn.id &&
              conn?.loginType === loginType && (
                <CircularProgress
                  color="primary"
                  sx={{ fontSize: (theme) => theme.spacing(2) }}
                />
              )}
            {isActive &&
              activeConnectorName === conn.id &&
              (activeConnectorName === "magic" ? (
                conn?.loginType === loginType ? (
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
  };

  return (
    <Dialog {...dialogProps} onClose={handelClose}>
      <AppDialogTitle
        icon={<Wallet />}
        title={
          <FormattedMessage
            id="connect.your.wallet"
            defaultMessage="Connect Your Wallet"
          />
        }
        onClose={handelClose}
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
