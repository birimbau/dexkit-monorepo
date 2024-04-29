import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import type { ThirdwebClient } from "thirdweb";
import {
  useActiveWallet,
  useConnect,
  useSetActiveWallet,
} from "thirdweb/react";
import {
  InjectedSupportedWalletIds,
  Wallet,
  createWallet,
} from "thirdweb/wallets";
import { WalletImage } from "./WalletImage";
import { useWalletInfo } from "./hooks/useWalletInfo";
import { getInstalledWalletProviders } from "./utils/injectedProviders";
type WalletSelectorProps = {
  wallets: Wallet[];
  client: ThirdwebClient;
};

function WalletItem({
  wallet,
  client,
}: {
  wallet: Wallet;
  client: ThirdwebClient;
}) {
  const walletInfo = useWalletInfo(wallet.id);
  const activeWallet = useActiveWallet();
  const setActiveWallet = useSetActiveWallet();
  const { connect, isConnecting, error } = useConnect();

  return (
    <ListItemButton
      divider
      key={wallet.id}
      disabled={false}
      onClick={() => {
        console.log(wallet);
        setActiveWallet(wallet);
        wallet.connect({ client });
      }}
    >
      <ListItemAvatar>
        <Avatar>
          <WalletImage id={wallet.id} client={client} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={walletInfo?.data?.name} />
      {isConnecting && wallet.id === activeWallet?.id && (
        <CircularProgress
          color="primary"
          sx={{ fontSize: (theme) => theme.spacing(2) }}
        />
      )}
      {wallet.id === activeWallet?.id && (
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
  );
}

type WalletConfig = {
  wallet: Wallet;
  isInstalled: boolean;
};

export function WalletSelector(props: WalletSelectorProps) {
  const { client } = props;
  const installedWallets = getInstalledWallets();

  const propsWallets = props.wallets;
  const _wallets: WalletConfig[] = propsWallets.length
    ? propsWallets.map((w) => {
        return { wallet: w, isInstalled: false };
      })
    : [];
  for (const iW of installedWallets) {
    if (!propsWallets.find((w) => w.id === iW.id)) {
      _wallets.push({ wallet: iW, isInstalled: true });
    }
  }

  return (
    <>
      {" "}
      {_wallets
        .sort(function (x, y) {
          return x.isInstalled ? -1 : 1;
        })
        .map((walletConfig: WalletConfig) => (
          <WalletItem
            wallet={walletConfig.wallet}
            key={walletConfig.wallet.id}
            client={client}
          />
        ))}
    </>
  );
}

let _installedWallets: Wallet[] = [];

function getInstalledWallets() {
  if (_installedWallets.length === 0) {
    const providers = getInstalledWalletProviders();
    const walletIds = providers.map((provider) => provider.info.rdns);
    _installedWallets = walletIds.map((w) =>
      createWallet(w as InjectedSupportedWalletIds)
    );
  }

  return _installedWallets;
}
