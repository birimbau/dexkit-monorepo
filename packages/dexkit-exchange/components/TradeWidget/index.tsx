import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  lighten,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";

import { FormattedMessage } from "react-intl";
import BuyForm from "./BuyForm";
import { TradeWidgetTab } from "./TradeWidgetTab";
import { TradeWidgetTabs } from "./TradeWidgetTabs";

import { useErc20BalanceQuery } from "@dexkit/core/hooks";
import { useWeb3React } from "@web3-react/core";
import { useExchangeContext } from "../../hooks";
import SellForm from "./SellForm";

import { useConnectWalletDialog } from "@dexkit/ui/hooks";

import WalletIcon from "@mui/icons-material/Wallet";
import MarketBuyForm from "./MarketBuyForm";
import MarketSellForm from "./MarketSellForm";

// FIXME: base/quote KIT/USDT
export interface TradeWidgetProps {
  isActive: boolean;
}

export default function TradeWidget({ isActive }: TradeWidgetProps) {
  const { quoteToken, baseToken, feeRecipient } = useExchangeContext();

  const [orderType, setOrderType] = useState<"market" | "limit">("market");

  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");

  const handleChangeOrderType = (
    e: SyntheticEvent,
    value: "market" | "limit"
  ) => {
    setOrderType(value);
  };

  const handleChangeOrderSide = (e: SyntheticEvent, value: "buy" | "sell") => {
    setOrderSide(value);
  };

  const { account, provider, chainId } = useWeb3React();

  const baseTokenBalanceQuery = useErc20BalanceQuery({
    account,
    provider,
    contractAddress: baseToken?.contractAddress,
  });

  const quoteTokenBalanceQuery = useErc20BalanceQuery({
    account,
    provider,
    contractAddress: quoteToken?.contractAddress,
  });

  const connectWalletDialog = useConnectWalletDialog();

  return (
    <Card>
      <CardHeader
        title={<FormattedMessage id="trade" defaultMessage="Trade" />}
        titleTypographyProps={{ variant: "body1" }}
      />
      <Divider />
      <CardContent sx={{ position: "relative" }}>
        {!isActive && (
          <Backdrop
            sx={{ position: "absolute", zIndex: (theme) => theme.zIndex.fab }}
            open
          >
            <Box py={4}>
              <Stack justifyContent="center" alignItems="center" spacing={2}>
                <Typography align="center" variant="body1">
                  <FormattedMessage
                    id="your.wallet.is.not.connected"
                    defaultMessage="Your wallet is not connected"
                  />
                </Typography>
                <Button
                  onClick={connectWalletDialog.handleConnectWallet}
                  startIcon={<WalletIcon />}
                  variant="contained"
                >
                  <FormattedMessage
                    id="connect.wallet"
                    defaultMessage="Connect wallet"
                  />
                </Button>
              </Stack>
            </Box>
          </Backdrop>
        )}

        <Stack spacing={2}>
          <TradeWidgetTabs
            onChange={handleChangeOrderType}
            value={orderType}
            variant="fullWidth"
          >
            <TradeWidgetTab
              value="market"
              label={<FormattedMessage id="market" defaultMessage="Market" />}
            />
            <TradeWidgetTab
              value="limit"
              label={<FormattedMessage id="limit" defaultMessage="Limit" />}
            />
          </TradeWidgetTabs>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: (theme) =>
                lighten(theme.palette.background.default, 0.1),
            }}
          >
            <Stack spacing={2}>
              <Tabs
                onChange={handleChangeOrderSide}
                value={orderSide}
                variant="fullWidth"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: (theme) =>
                      orderSide === "buy"
                        ? theme.palette.success.main
                        : theme.palette.error.light,
                  },
                  "& .Mui-selected": {
                    color: (theme) =>
                      orderSide === "buy"
                        ? theme.palette.success.main
                        : theme.palette.error.light,
                  },
                }}
              >
                <Tab
                  value="buy"
                  label={<FormattedMessage id="buy" defaultMessage="Buy" />}
                />
                <Tab
                  value="sell"
                  label={<FormattedMessage id="sell" defaultMessage="Sell" />}
                />
              </Tabs>
              <Divider />
              {orderSide === "buy" &&
              orderType == "limit" &&
              quoteToken &&
              baseToken ? (
                <BuyForm
                  key={`buy-${baseToken.contractAddress}-${quoteToken.contractAddress}`}
                  makerToken={baseToken}
                  takerToken={quoteToken}
                  makerTokenBalance={baseTokenBalanceQuery.data}
                  maker={account}
                  provider={provider}
                />
              ) : null}
              {orderSide === "sell" &&
              orderType === "limit" &&
              quoteToken &&
              baseToken ? (
                <SellForm
                  key={`sell-${baseToken.contractAddress}-${quoteToken.contractAddress}`}
                  makerToken={baseToken}
                  takerToken={quoteToken}
                  takerTokenBalance={quoteTokenBalanceQuery.data}
                  provider={provider}
                  maker={account}
                />
              ) : null}
              {orderType === "market" &&
              orderSide === "buy" &&
              quoteToken &&
              baseToken ? (
                <MarketBuyForm
                  key={`market-buy-${baseToken.contractAddress}-${quoteToken.contractAddress}`}
                  quoteToken={quoteToken}
                  baseToken={baseToken}
                  provider={provider}
                  account={account}
                  quoteTokenBalance={quoteTokenBalanceQuery.data}
                  baseTokenBalance={baseTokenBalanceQuery.data}
                  chainId={chainId}
                  affiliateAddress={feeRecipient}
                  isActive={isActive}
                />
              ) : null}

              {orderType === "market" &&
              orderSide === "sell" &&
              quoteToken &&
              baseToken ? (
                <MarketSellForm
                  key={`market-sell-${baseToken.contractAddress}-${quoteToken.contractAddress}`}
                  quoteToken={quoteToken}
                  baseToken={baseToken}
                  provider={provider}
                  account={account}
                  quoteTokenBalance={quoteTokenBalanceQuery.data}
                  baseTokenBalance={baseTokenBalanceQuery.data}
                  chainId={chainId}
                  affiliateAddress={feeRecipient}
                  isActive={isActive}
                />
              ) : null}
            </Stack>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  );
}
