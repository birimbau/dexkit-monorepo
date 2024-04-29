import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { InjectedSupportedWalletIds, Wallet } from "thirdweb/wallets";
import { WalletImage } from "./WalletImage";
import { WalletInfo } from "./types";

export const InjectedConnectUI = (props: {
  onGetStarted: () => void;
  client: any;
  chain: any;
  wallet: Wallet<InjectedSupportedWalletIds>;
  walletInfo: WalletInfo;
  onBack?: () => void;
  done: () => void;
}) => {
  const { wallet, done, chain, client } = props;

  const [errorConnecting, setErrorConnecting] = useState(false);

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setErrorConnecting(false);
      // await wait(1000);
      await wallet.connect({
        client,
        chain: chain,
      });

      done();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [client, chain, done, wallet]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }

    connectToExtension();
  }, [connectToExtension]);

  return (
    <ListItemButton divider disabled={false} onClick={() => {}}>
      <ListItemAvatar>
        <Avatar>
          <WalletImage id={wallet.id} client={client} />
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
  );
};
