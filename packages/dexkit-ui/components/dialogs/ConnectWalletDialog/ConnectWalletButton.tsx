import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import { FormattedMessage } from "react-intl";
import { createThirdwebClient } from "thirdweb";
import { AutoConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { THIRDWEB_CLIENT_ID } from "../../../constants/thirdweb";
import { useConnectWalletDialog } from "../../../hooks";
import Wallet from "../../icons/Wallet";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

export function ConnectWalletButton() {
  const connectWalletDialog = useConnectWalletDialog();

  const handleOpenConnectWalletDialog = () => {
    connectWalletDialog.setOpen(true);
  };

  return (
    <>
      <AutoConnect client={client} timeout={10000} wallets={wallets} />

      <Button
        variant="outlined"
        color="inherit"
        onClick={handleOpenConnectWalletDialog}
        startIcon={<Wallet />}
        endIcon={<ChevronRightIcon />}
      >
        <FormattedMessage
          id="connect.wallet"
          defaultMessage="Connect Wallet"
          description="Connect wallet button"
        />
      </Button>
    </>
  );
}
