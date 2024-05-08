import { UserEvents } from "@dexkit/core/constants/userEvents";
import { getBlockExplorerUrl, truncateAddress } from "@dexkit/core/utils";
import { TableCell, TableRow } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";
import Link from "../../../components/AppLink";
import MomentFormatted from "../../../components/MomentFomatted";
import { UserEvent } from "../hooks/useUserActivity";
import UserActivityBuyDropCollection from "./UserActivityBuyDropCollection";
import UserActivityBuyDropEdition from "./UserActivityBuyDropEdition";
import UserActivityBuyDropToken from "./UserActivityBuyDropToken";
import UserActivityLockPurchasePrice from "./UserActivityLockPurchasePrice";
import UserActivityLockRenewPrice from "./UserActivityLockRenewPrice";

export interface UserActivityTableRowProps {
  event: UserEvent;
}

export default function UserActivityTableRow({
  event,
}: UserActivityTableRowProps) {
  let cells: React.ReactNode[] = [];

  if (event.type === UserEvents.approve) {
    cells.push(<FormattedMessage id="approve" defaultMessage="Approve" />);
  }

  if (event.type === UserEvents.buyDropToken) {
    cells.push(<UserActivityBuyDropToken event={event} />);
  }

  if (event.type === UserEvents.buyDropCollection) {
    cells.push(<UserActivityBuyDropCollection event={event} />);
  }

  if (event.type === UserEvents.buyDropEdition) {
    cells.push(<UserActivityBuyDropEdition event={event} />);
  }

  if (event.type === UserEvents.marketSell) {
    const { tokenOutAmount, tokenInAmount, tokenOut, tokenIn } =
      event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="sell.for"
        defaultMessage="Sell {tokenOutAmount} {tokenOutSymbol} for {tokenInAmount} {tokenInSymbol}"
        values={{
          tokenOutAmount,
          tokenInAmount,
          tokenOutSymbol: tokenOut?.symbol,
          tokenInSymbol: tokenIn?.symbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.renewKey) {
    cells.push(<UserActivityLockRenewPrice event={event} />);
  }

  if (event.type === UserEvents.purchaseKey) {
    cells.push(<UserActivityLockPurchasePrice event={event} />);
  }

  if (event.type === UserEvents.marketBuy) {
    const { tokenOutAmount, tokenInAmount, tokenOut, tokenIn } =
      event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="buy.for"
        defaultMessage="Buy {tokenInAmount} {tokenInSymbol} for {tokenOutAmount} {tokenOutSymbol}"
        values={{
          tokenOutAmount,
          tokenInAmount,
          tokenOutSymbol: tokenOut?.symbol,
          tokenInSymbol: tokenIn?.symbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.transfer) {
    const { to, amount, token } = event.processedMetadata;
    cells.push(
      <FormattedMessage
        id="transfer.amount"
        defaultMessage="Transfer {amount} {symbol} to {to}"
        values={{
          to: (
            <Link
              href={`${
                event.chainId ? getBlockExplorerUrl(event.chainId) : undefined
              }/address/${to}`}
            >
              {truncateAddress(to)}
            </Link>
          ),
          amount,
          symbol: token.symbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.receive) {
    const { from, amount, token } = event.processedMetadata;
    cells.push(
      <FormattedMessage
        id="transfer.amount"
        defaultMessage="Receive {amount} {symbol} from {from}"
        values={{
          from: (
            <Link
              href={`${
                event.chainId ? getBlockExplorerUrl(event.chainId) : undefined
              }/address/${from}`}
            >
              {truncateAddress(from)}
            </Link>
          ),
          amount,
          symbol: token.symbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.swap) {
    const { tokenOutAmount, tokenInAmount, tokenOut, tokenIn } =
      event.processedMetadata;

    cells.push(
      <FormattedMessage
        id="swap.for"
        defaultMessage="Swap {tokenOutAmount} {tokenOutSymbol} for {tokenInAmount} {tokenInSymbol}"
        values={{
          tokenOutAmount,
          tokenInAmount,
          tokenOutSymbol: tokenOut?.symbol,
          tokenInSymbol: tokenIn?.symbol,
        }}
      />
    );
  }

  if (event.type === UserEvents.deployContract) {
    const { name, type, address } = event.processedMetadata as any;

    cells.push(
      <FormattedMessage
        id="deploy.contract"
        defaultMessage="Deploy contract: {contract}"
        values={{
          contract: (
            <Link
              href={`${
                event.chainId ? getBlockExplorerUrl(event.chainId) : undefined
              }/address/${address}`}
            >
              {name}
            </Link>
          ),
        }}
      />
    );
  }

  return (
    <TableRow>
      {cells.map((cell) => (
        <TableCell>{cell}</TableCell>
      ))}
      <TableCell>
        <MomentFormatted date={event.createdAt} format="LLLL" />
      </TableCell>
      <TableCell>
        {event.hash && (
          <Link
            href={`${getBlockExplorerUrl(
              event.chainId ? event.chainId : undefined
            )}/tx/${event.hash}`}
            target="_blank"
          >
            <FormattedMessage id="view.tx" defaultMessage="View" />
          </Link>
        )}
      </TableCell>
    </TableRow>
  );
}
