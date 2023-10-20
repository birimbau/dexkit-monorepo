import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import WalletIcon from "@mui/icons-material/Wallet";
import Button from "@mui/material/Button";
import { FormattedMessage } from "react-intl";
import { useConnectWalletDialog } from "../hooks";

export function ConnectWalletButton() {
  const connectWalletDialog = useConnectWalletDialog();

  const handleOpenConnectWalletDialog = () => {
    connectWalletDialog.setOpen(true);
  };
  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={handleOpenConnectWalletDialog}
      startIcon={<WalletIcon />}
      endIcon={<ChevronRightIcon />}
    >
      <FormattedMessage
        id="connect.wallet"
        defaultMessage="Connect Wallet"
        description="Connect wallet button"
      />
    </Button>
  );
}
