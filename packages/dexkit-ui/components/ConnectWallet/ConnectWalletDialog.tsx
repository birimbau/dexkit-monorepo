import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
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

import { getIsInjectedMobileBrowser } from "@dexkit/wallet-connectors/connectors/connections";
import { MagicLoginType } from "@dexkit/wallet-connectors/connectors/magic";
import { MagicOauthConnectors } from "@dexkit/wallet-connectors/connectors/magic-wagmi/magicConnector";
import { ConnectorIcon } from "@dexkit/wallet-connectors/rainbowkit/components/ConnectorIcon";
import { useWalletConnectors } from "@dexkit/wallet-connectors/rainbowkit/wallets/useWalletConnectors";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Wallet from "@mui/icons-material/Wallet";
import { useConnect } from "wagmi";
import { useActiveChainIds, useConnectWalletDialog } from "../../hooks";
import { AppDialogTitle } from "../AppDialogTitle";

export interface ConnectWalletDialogProps {
  DialogProps: DialogProps;
  isActivating: boolean;
  isActive: boolean;
  activeConnectorName?: string;
  magicRedirectUrl?: string;
}

export default function ConnectWalletDialog({
  DialogProps: dialogProps,
  isActivating,
  isActive,
  activeConnectorName,
}: ConnectWalletDialogProps) {
  const { activeChainIds } = useActiveChainIds();
  const connectWalletDialog = useConnectWalletDialog();

  const connectors = useWalletConnectors({
    activeChainIds,
    defaultChainId: activeChainIds[0],
    setConnectWalletState: connectWalletDialog.setOpen,
  });

  const { connectors: wagmiConnectors } = useConnect();

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

  const [email, setEmail] = useState("");

  const handleConnectWithEmail = () => {
    const magicConnector = wagmiConnectors.find((c) => c.id === "magic");

    if (magicConnector) {
      //@ts-ignore
      magicConnector.connect({ email });
    }

    setEmail("");
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail((e.target as any).value);
  };

  const renderConnectors = () => {
    return connectors.map((conn, index: number) => (
      <>
        <ListItemButton
          divider
          key={index}
          disabled={isActivating && connectorName === conn.name}
          onClick={async () => {
            try {
              setConnectorName(conn?.name);

              if (conn.id === "walletConnect" && conn?.showWalletConnectModal) {
                await conn?.showWalletConnectModal();
              } else {
                await conn.connect();
              }

              handleClose();
            } catch (err: any) {
              enqueueSnackbar(err.message, {
                variant: "error",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
              });
              setLoginType(undefined);
              setConnectorName(undefined);
            }
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <ConnectorIcon
                name={conn.name}
                icon={conn.icon || conn?.iconUrl}
              />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={conn?.name} />
          {isActivating && connectorName === conn?.name && (
            <CircularProgress
              color="primary"
              sx={{ fontSize: (theme) => theme.spacing(2) }}
            />
          )}
          {isActive && activeConnectorName === conn?.name && (
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
      </>
    ));
  };

  const renderOauthConnectors = () => {
    return MagicOauthConnectors.map((conn, index: number) => (
      <>
        <ListItemButton
          divider
          key={index}
          disabled={isActivating && connectorName === conn.name}
          onClick={async () => {
            try {
              setConnectorName(conn?.name);

              const magicConnector = wagmiConnectors.find(
                (c) => c.id === "magic"
              );

              if (magicConnector) {
                //@ts-ignore
                await magicConnector.connect({ oauthProvider: conn.oauth });
              }

              setLoginType(conn.oauth as any);

              handleClose();
            } catch (err: any) {
              enqueueSnackbar(err.message, {
                variant: "error",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
              });
              setLoginType(undefined);
              setConnectorName(undefined);
            }
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <ConnectorIcon name={conn.name} icon={conn.icon} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={conn?.name} />
          {isActivating && connectorName === conn?.name && (
            <CircularProgress
              color="primary"
              sx={{ fontSize: (theme) => theme.spacing(2) }}
            />
          )}
          {isActive && activeConnectorName === conn?.name && (
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
        {!getIsInjectedMobileBrowser() && (
          <>
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
          </>
        )}
        <List disablePadding>
          {renderConnectors()}
          {renderOauthConnectors()}
        </List>
      </DialogContent>
    </Dialog>
  );
}
