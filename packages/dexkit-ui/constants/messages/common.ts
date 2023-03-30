import { AppNotificationType } from "../../types";

export const COMMON_NOTIFICATION_TYPES: { [key: string]: AppNotificationType } =
  {
    approve: {
      type: "approve",
      message: "Approve {name} ({symbol}) to trade",
      id: "approve.name.symbol.to.trade",
      color: "primary.light",
    },
    approveForAll: {
      type: "approveForAll",
      message: "Approve {name} ({tokenId}) to trade",
      id: "approve.name.tokenId.to.trade",
    },
    unwrap: {
      type: "unwrap",
      message: "Unwrap {amount} ({symbol})",
      id: "unwrap.amount.symbol",
    },
    wrap: {
      type: "wrap",
      message: "Unwrap {amount} ({symbol})",
      id: "wrap.amount.symbol",
    },
    swap: {
      type: "swap",
      color: "primary.light",
      message:
        "Swap {sellAmount} {sellTokenSymbol} for {buyAmount} {buyTokenSymbol}",
      id: "swap.sellamount.symbol.for.buyamount.symbol",
    },
    transfer: {
      type: "transfer",
      message: "Send {amount} {symbol} to {address}",
      id: "send.amount.symbol.to.address",
    },
  };
