import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Stack,
  Tabs,
  Typography,
  lighten,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";

import { FormattedMessage } from "react-intl";
import BuyForm from "./BuyForm";
import TradeWidgetTabAlt from "./TradeWidgetTabAlt";
import { TradeWidgetTabs } from "./TradeWidgetTabs";

import { useErc20BalanceQuery } from "@dexkit/core/hooks";
import { useExchangeContext } from "../../hooks";
import SellForm from "./SellForm";

import { NETWORKS } from "@dexkit/core/constants/networks";
import { DEFAULT_ZRX_NETWORKS } from "../../constants";
import MarketBuyForm from "./MarketBuyForm";
import MarketSellForm from "./MarketSellForm";
import TradeWidgetTab from "./TradeWidgetTab";

// FIXME: base/quote KIT/USDT
export interface TradeWidgetProps {
  isActive: boolean;
}

export default function TradeWidget({ isActive }: TradeWidgetProps) {
  const {
    quoteToken,
    baseToken,
    feeRecipient,
    buyTokenPercentageFee,
    affiliateAddress,
    chainId,
    provider,
    account,
    availNetworks,
  } = useExchangeContext();

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

  const renderContent = () => {
    if (
      (chainId && !availNetworks.includes(chainId)) ||
      !baseToken ||
      !quoteToken
    ) {
      return (
        <Stack>
          <Typography align="center" variant="h5">
            <FormattedMessage
              id="unsupported.network"
              defaultMessage="Unsupported Network"
            />
          </Typography>
          <Typography align="center" variant="body1">
            <FormattedMessage
              id="please.switch.to.networks"
              defaultMessage="Please, switch to {networks}"
              values={{
                networks: DEFAULT_ZRX_NETWORKS.map(
                  (chain) => NETWORKS[chain].name
                ).join(", "),
              }}
            />
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={2}>
        <Tabs
          onChange={handleChangeOrderSide}
          value={orderSide}
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: (theme) =>
                orderSide === "buy"
                  ? theme.palette.success.light
                  : theme.palette.error.light,
            },
            "& .Mui-selected": {
              color: (theme) =>
                orderSide === "buy"
                  ? theme.palette.success.light
                  : theme.palette.error.light,
            },
          }}
        >
          <TradeWidgetTabAlt
            value="buy"
            label={<FormattedMessage id="buy" defaultMessage="Buy" />}
          />
          <TradeWidgetTabAlt
            value="sell"
            label={<FormattedMessage id="sell" defaultMessage="Sell" />}
          />
        </Tabs>
        <Divider />

        {chainId &&
        !DEFAULT_ZRX_NETWORKS.includes(chainId) &&
        orderType === "limit" ? (
          <Stack py={4}>
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="unsupported.network"
                defaultMessage="Unsupported Network"
              />
            </Typography>
            <Typography align="center" variant="body1">
              <FormattedMessage
                id="please.switch.to.networks"
                defaultMessage="Please, switch to {networks}"
                values={{
                  networks: DEFAULT_ZRX_NETWORKS.map(
                    (chain) => NETWORKS[chain].name
                  ).join(", "),
                }}
              />
            </Typography>
          </Stack>
        ) : (
          <>
            {orderSide === "buy" &&
            orderType == "limit" &&
            quoteToken &&
            baseToken ? (
              <BuyForm
                key={`buy-${baseToken.contractAddress}-${quoteToken.contractAddress}`}
                baseToken={baseToken}
                quoteToken={quoteToken}
                quoteTokenBalance={quoteTokenBalanceQuery.data}
                feeRecipient={feeRecipient}
                maker={account}
                provider={provider}
                affiliateAddress={affiliateAddress}
                chainId={chainId}
              />
            ) : null}
            {orderSide === "sell" &&
            orderType === "limit" &&
            quoteToken &&
            baseToken ? (
              <SellForm
                key={`sell-${baseToken.contractAddress}-${quoteToken.contractAddress}`}
                quoteToken={quoteToken}
                baseToken={baseToken}
                baseTokenBalance={baseTokenBalanceQuery.data}
                provider={provider}
                feeRecipient={feeRecipient}
                buyTokenPercentageFee={buyTokenPercentageFee}
                maker={account}
                affiliateAddress={affiliateAddress}
                chainId={chainId}
              />
            ) : null}
          </>
        )}

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
            affiliateAddress={affiliateAddress}
            feeRecipient={feeRecipient}
            isActive={isActive}
            chainId={chainId}
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
            buyTokenPercentageFee={buyTokenPercentageFee}
            affiliateAddress={affiliateAddress}
            feeRecipient={feeRecipient}
            isActive={isActive}
            chainId={chainId}
          />
        ) : null}
      </Stack>
    );
  };

  return (
    <Card>
      <CardHeader
        title={<FormattedMessage id="trade" defaultMessage="Trade" />}
        titleTypographyProps={{ variant: "body1" }}
      />
      <Divider />
      <CardContent>
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
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? lighten(theme.palette.background.paper, 0.1)
                  : theme.palette.background.default,
            }}
          >
            {renderContent()}
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  );
}
