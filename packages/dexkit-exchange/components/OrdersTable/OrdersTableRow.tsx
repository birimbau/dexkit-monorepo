import { ZrxOrder, ZrxOrderRecord } from "@dexkit/core/services/zrx/types";
import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import MomentFromSpan from "@dexkit/ui/components/MomentFromSpan";
import { Button, TableCell, TableRow } from "@mui/material";
import { ethers } from "ethers";
import moment from "moment";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

export interface OrdersTableRowProps {
  baseToken?: Token;
  quoteToken?: Token;
  record: ZrxOrderRecord;
  account?: string;
  onCancel: (order: ZrxOrder) => void;
}

export default function OrdersTableRow({
  record,
  quoteToken,
  baseToken,
  account,
  onCancel,
}: OrdersTableRowProps) {
  const side = useMemo(() => {
    return isAddressEqual(baseToken?.contractAddress, record.order.takerToken)
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
    onCancel(record.order);
  };

  return (
    <TableRow>
      <TableCell>
        {side === "buy" ? (
          <FormattedMessage id="buy" defaultMessage="Buy" />
        ) : (
          <FormattedMessage id="sell" defaultMessage="Sell" />
        )}
      </TableCell>
      <TableCell>
        {baseTokenAmount} {baseTokenSymbol}
      </TableCell>
      <TableCell>
        {remainingFillableAmountFormatted} {quoteTokenSymbol}
      </TableCell>

      <TableCell>
        {quoteTokenAmount} {quoteTokenSymbol}
      </TableCell>
      <TableCell>
        <MomentFromSpan from={moment(parseInt(record.order.expiry) * 1000)} />
      </TableCell>

      <TableCell></TableCell>
      <TableCell>
        <Button
          onClick={handleCancel}
          disabled={
            !isAddressEqual(account, record.order.maker) &&
            !isAddressEqual(account, record.order.taker)
          }
          size="small"
        >
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
