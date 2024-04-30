import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import { FormattedMessage } from "react-intl";
import { createThirdwebClient } from "thirdweb";
import { AutoConnect, useActiveWalletConnectionStatus } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { THIRDWEB_CLIENT_ID } from "../../../constants/thirdweb";
import { useConnectWalletDialog } from "../../../hooks";
import Wallet from "../../icons/Wallet";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("com.trustwallet.app"),
  createWallet("walletConnect"),
];

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

export function ConnectWalletButton() {
  const connectionStatus = useActiveWalletConnectionStatus();

  const connectWalletDialog = useConnectWalletDialog();

  const handleOpenConnectWalletDialog = () => {
    connectWalletDialog.setOpen(true);
  };

  const isLoading = connectionStatus === "connecting";

  return (
    <>
      <AutoConnect client={client} timeout={10000} wallets={wallets} />

      <Button
        variant="outlined"
        color="inherit"
        disabled={isLoading}
        onClick={handleOpenConnectWalletDialog}
        startIcon={<Wallet />}
        endIcon={<ChevronRightIcon />}
      >
        {isLoading ? (
          <FormattedMessage
            id="connecting.wallet"
            defaultMessage="Connecting Wallet"
            description="Connect wallet button"
          />
        ) : (
          <FormattedMessage
            id="connect.wallet"
            defaultMessage="Connect Wallet"
            description="Connect wallet button"
          />
        )}
      </Button>
    </>
  );
}
