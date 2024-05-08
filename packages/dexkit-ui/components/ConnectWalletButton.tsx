import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FormattedMessage } from "react-intl";
import { useConnectWalletDialog } from "../hooks";
import WalletIcon from "./icons/Wallet";

export function ConnectWalletButton() {
  const { isActivating } = useWeb3React();

  const connectWalletDialog = useConnectWalletDialog();

  const handleOpenConnectWalletDialog = () => {
    connectWalletDialog.setOpen(true);
  };
  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={handleOpenConnectWalletDialog}
      startIcon={
        isActivating ? (
          <CircularProgress
            color="inherit"
            sx={{ fontSize: (theme) => theme.spacing(2) }}
          />
        ) : (
          <WalletIcon />
        )
      }
      endIcon={<ChevronRightIcon />}
    >
      {isActivating ? (
        <FormattedMessage
          id="loading.wallet"
          defaultMessage="Loading Wallet"
          description="Loading wallet button"
        />
      ) : (
        <FormattedMessage
          id="connect.wallet"
          defaultMessage="Connect Wallet"
          description="Connect wallet button"
        />
      )}
    </Button>
  );
}
