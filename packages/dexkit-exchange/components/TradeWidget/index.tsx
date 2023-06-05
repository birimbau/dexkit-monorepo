import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  lighten,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";

import { FormattedMessage } from "react-intl";
import { KIT_TOKEN, USDT_TOKEN } from "../../constants";
import BuyForm from "./BuyForm";
import { TradeWidgetTab } from "./TradeWidgetTab";
import { TradeWidgetTabs } from "./TradeWidgetTabs";

import { useErc20BalanceQuery } from "@dexkit/core/hooks";
import { useWeb3React } from "@web3-react/core";

export interface TradeWidgetProps {
  makerToken: string;
  takerToken: string;
}

export default function TradeWidget({
  makerToken,
  takerToken,
}: TradeWidgetProps) {
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

  const { account, provider } = useWeb3React();

  const makerTokenBalanceQuery = useErc20BalanceQuery({
    account,
    provider,
    contractAddress: USDT_TOKEN.contractAddress,
  });

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
          {/* <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: (theme) =>
                lighten(theme.palette.background.default, 0.1),
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>
                <FormattedMessage
                  id="available.balance"
                  defaultMessage="Available balance"
                />
              </Typography>

              <Typography>3.5 ETH</Typography>
            </Stack>
          </Paper> */}

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
              {orderSide === "buy" ? (
                <BuyForm
                  makerToken={USDT_TOKEN}
                  takerToken={KIT_TOKEN}
                  makerTokenBalance={makerTokenBalanceQuery.data}
                />
              ) : null}
            </Stack>
          </Paper>

          {/* <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: (theme) =>
                lighten(theme.palette.background.default, 0.1),
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>
                <FormattedMessage
                  id="available.balance"
                  defaultMessage="Available balance"
                />
              </Typography>

              <Typography>3.5 ETH</Typography>
            </Stack>
          </Paper> */}
        </Stack>
      </CardContent>
    </Card>
  );
}
