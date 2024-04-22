import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { ThemeMode } from "../constants/enum";
import { THIRDWEB_CLIENT_ID } from "../constants/thirdweb";
import { useThemeMode } from "../hooks";

const client = createThirdwebClient({ clientId: THIRDWEB_CLIENT_ID });

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

export function ConnectWalletButton() {
  const { mode } = useThemeMode();

  return (
    <ConnectButton
      client={client}
      theme={mode === ThemeMode.dark ? "dark" : "light"}
      wallets={wallets}
      connectModal={{ showThirdwebBranding: false, titleIcon: "" }}
    />
  );
}
