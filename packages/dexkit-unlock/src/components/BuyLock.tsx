import { NETWORK_SLUG } from "@dexkit/core/constants/networks";
import { useConnectWalletDialog, useSwitchNetworkMutation } from "@dexkit/ui";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import KeyIcon from "@mui/icons-material/Key";
import Wallet from "@mui/icons-material/Wallet";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { useWeb3React } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { usePurchaseLockKeysMutation } from "../hooks";
interface Props {
  lockName?: string;
  lockAddress: string;
  lockChainId: number;
  price: string;
  tokenId?: number;
  currencyAddress: string | null;
  token: {
    name?: string;
    imageUrl?: string;
    symbol?: string;
  };
  remainingTickets: number;
}

export default function BuyLock({
  lockAddress,
  lockName,
  token,
  tokenId,
  lockChainId,
  price,
  remainingTickets,
  currencyAddress,
}: Props) {
  const { account, chainId } = useWeb3React();
  const purchaseLockMutation = usePurchaseLockKeysMutation();

  const connectWalletDialog = useConnectWalletDialog();
  const switchNetwork = useSwitchNetworkMutation();

  const handleSwitchNetwork = async () => {
    if (chainId && lockChainId !== chainId) {
      await switchNetwork.mutateAsync({ chainId: lockChainId });
    }
  };

  const handleConnectWallet = () => {
    connectWalletDialog.setOpen(true);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          {false && (
            <Grid item xs={12}>
              <Typography variant="body1">{lockName || " "}</Typography>
            </Grid>
          )}
          {tokenId !== undefined && chainId && (
            <Grid item xs={12}>
              <Stack
                spacing={1}
                flexDirection={"column"}
                alignContent={"center"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Typography variant="body1">
                  <FormattedMessage
                    id={"you.already.own.key"}
                    defaultMessage={"You already own a key"}
                  />
                </Typography>
                <Button
                  href={`/asset/${NETWORK_SLUG(
                    chainId
                  )}/${lockAddress}/${tokenId}`}
                  startIcon={<KeyIcon />}
                  variant={"contained"}
                >
                  <FormattedMessage id={"see.key"} defaultMessage={"See key"} />
                </Button>
              </Stack>
            </Grid>
          )}

          {tokenId === undefined && (
            <>
              <Grid item xs={12}>
                <Box
                  display={"flex"}
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"space-evenly"}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignContent={"center"}
                    alignItems={"center"}
                    justifyContent={"space-around"}
                  >
                    <Avatar
                      src={token?.imageUrl || " "}
                      alt={token?.name || " "}
                    ></Avatar>
                    <Typography variant="body2">{price || "0"}</Typography>
                    <Typography sx={{ pl: 1 }} variant="body2">
                      {token?.symbol}
                    </Typography>
                  </Box>
                  {remainingTickets !== -1 && (
                    <Box
                      flexDirection={"row"}
                      display={"flex"}
                      alignContent={"center"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <ConfirmationNumberIcon />

                      <Typography sx={{ pl: 1 }}>
                        <b>{remainingTickets || "0"}</b>
                      </Typography>
                      <Typography sx={{ pl: 1 }}>
                        <FormattedMessage
                          id={"left"}
                          defaultMessage={"Left"}
                        ></FormattedMessage>
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display={"flex"} justifyContent={"center"}>
                  {!account && (
                    <Button
                      onClick={handleConnectWallet}
                      variant="contained"
                      startIcon={<Wallet />}
                    >
                      <FormattedMessage
                        id="connect.wallet"
                        defaultMessage="Connect Wallet"
                      />
                    </Button>
                  )}

                  {account && lockChainId !== chainId && (
                    <Button
                      onClick={handleSwitchNetwork}
                      color="inherit"
                      variant="outlined"
                      size="small"
                      disabled={switchNetwork.isLoading}
                      startIcon={
                        switchNetwork.isLoading ? (
                          <CircularProgress color="inherit" size="1rem" />
                        ) : undefined
                      }
                    >
                      <FormattedMessage
                        id="switch.network"
                        defaultMessage="Switch network"
                      />
                    </Button>
                  )}

                  {account && lockChainId === chainId && (
                    <Button
                      onClick={() =>
                        purchaseLockMutation.mutate({
                          lockAddress: lockAddress,
                          lockName: lockName,
                          currency: currencyAddress,
                          keyPrice: price,
                        })
                      }
                      disabled={purchaseLockMutation.isLoading}
                      startIcon={
                        purchaseLockMutation.isLoading ? (
                          <CircularProgress color="inherit" size="1rem" />
                        ) : (
                          <KeyIcon />
                        )
                      }
                      variant={"contained"}
                    >
                      <FormattedMessage
                        id={"buy.key"}
                        defaultMessage={"Buy key"}
                      />
                    </Button>
                  )}
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
