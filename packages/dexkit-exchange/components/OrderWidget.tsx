import { ZrxOrder, ZrxOrderRecord } from "@dexkit/core/services/zrx/types";
import { isAddressEqual } from "@dexkit/core/utils";
import MomentFromSpan from "@dexkit/ui/components/MomentFromSpan";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { ethers } from "ethers";
import moment from "moment";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

export interface OrderWidgetProps {
  record: ZrxOrderRecord;
  account?: string;
  onCancel: (
    order: ZrxOrder,
    baseTokenSymbol?: string,
    quoteTokenSymbol?: string,
    baseTokenAmount?: string,
    quoteTokenAmount?: string
  ) => void;
}

export default function OrderWidget({
  record,
  account,
  onCancel,
}: OrderWidgetProps) {
  const side = useMemo(() => {
    return isAddressEqual(baseToken?.address, record.order.takerToken)
      ? "buy"
      : "sell";
  }, [baseToken, record]);

  const quoteTokenAmount = useMemo(() => {
    const decimals =
      side === "sell" ? quoteToken?.decimals : baseToken?.decimals;

    return ethers.utils.formatUnits(record.order.takerAmount, decimals);
  }, [record, quoteToken]);

  const baseTokenAmount = useMemo(() => {
    const decimals =
      side === "buy" ? quoteToken?.decimals : baseToken?.decimals;

    return ethers.utils.formatUnits(record.order.makerAmount, decimals);
  }, [record, baseToken, side]);

  const price = useMemo(() => {
    if (baseTokenAmount && quoteTokenAmount) {
      return side === "buy"
        ? Number(baseTokenAmount) / Number(quoteTokenAmount)
        : Number(quoteTokenAmount) / Number(baseTokenAmount);
    }
  }, [quoteTokenAmount, baseTokenAmount, side]);

  const remainingFillableAmountFormatted = useMemo(() => {
    const decimals =
      side === "buy" ? baseToken?.decimals : quoteToken?.decimals;

    const amountToBeFilled = ethers.BigNumber.from(record.order.takerAmount);
    const remainingFillableAmount = ethers.BigNumber.from(
      record.metaData.remainingFillableTakerAmount
    );

    return ethers.utils.formatUnits(
      amountToBeFilled.sub(remainingFillableAmount),
      decimals
    );
  }, [quoteToken, record]);

  const quoteTokenSymbol = useMemo(() => {
    const symbol =
      side === "sell"
        ? quoteToken?.symbol.toUpperCase()
        : baseToken?.symbol.toUpperCase();

    return symbol;
  }, [record, quoteToken]);

  const baseTokenSymbol = useMemo(() => {
    const symbol =
      side === "buy"
        ? quoteToken?.symbol.toUpperCase()
        : baseToken?.symbol.toUpperCase();

    return symbol;
  }, [record, quoteToken]);

  const handleCancel = () => {
    onCancel(
      record.order,
      baseTokenSymbol,
      quoteTokenSymbol,
      baseTokenAmount,
      quoteTokenAmount
    );
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="type" defaultMessage="Type" />
            </Typography>
            <Typography
              sx={{
                color: (theme) =>
                  side === "buy"
                    ? theme.palette.success.main
                    : theme.palette.error.main,
              }}
            >
              {side === "buy" ? (
                <FormattedMessage id="buy" defaultMessage="Buy" />
              ) : (
                <FormattedMessage id="sell" defaultMessage="Sell" />
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="amount" defaultMessage="Amount" />
            </Typography>
            <Typography>
              {baseTokenAmount} {baseTokenSymbol}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage
                id="fillable.amount"
                defaultMessage="Fillable amount"
              />
            </Typography>
            <Typography>
              {remainingFillableAmountFormatted} {quoteTokenSymbol}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="price" defaultMessage="Price" />
            </Typography>
            <Typography>
              {price} {quoteTokenSymbol}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="expire" defaultMessage="Expire" />
            </Typography>
            <Typography>
              <MomentFromSpan
                from={moment(parseInt(record.order.expiry) * 1000)}
              />
            </Typography>
          </Grid>
        </Grid>

        {isAddressEqual(account, record.order.maker) &&
          isAddressEqual(account, record.order.taker) && (
            <Button
              fullWidth
              color="error"
              variant="outlined"
              onClick={handleCancel}
              size="small"
            >
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
          )}
      </CardContent>
    </Card>
  );
}
