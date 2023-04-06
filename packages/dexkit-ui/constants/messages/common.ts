import { AppNotificationType } from "../../types";

export const COMMON_NOTIFICATION_TYPES: { [key: string]: AppNotificationType } =
{
  approve: {
    type: "approve",
    message: "Approve {name} ({symbol}) to trade",
    id: "approve.name.symbol.to.trade",
    color: "primary.light",
    icon: "check",
  },
  approveForAll: {
    type: "approveForAll",
    message: "Approve {name} ({tokenId}) to trade",
    id: "approve.name.tokenId.to.trade",
    icon: "check",
  },
  unwrap: {
    type: "unwrap",
    message: "Unwrap {amount} ({symbol})",
    id: "unwrap.amount.symbol",
    icon: "check",
  },
  wrap: {
    type: "wrap",
    message: "Unwrap {amount} ({symbol})",
    id: "wrap.amount.symbol",
    icon: "check",
  },
  swap: {
    type: "swap",
    color: "primary.light",
    message:
      "Swap {sellAmount} {sellTokenSymbol} for {buyAmount} {buyTokenSymbol}",
    id: "swap.sellamount.symbol.for.buyamount.symbol",
    icon: "swap_vert",
  },
  transfer: {
    type: "transfer",
    message: "Send {amount} {symbol} to {address}",
    id: "send.amount.symbol.to.address",
    icon: "shortcut",
  },
  nftTransfer: {
    type: "nftTransfer",
    message: "Transfer {name} #{id}",
    id: "transfer.name.id",
    icon: "shortcut",
  },
};
