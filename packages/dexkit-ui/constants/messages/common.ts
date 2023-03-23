import { AppNotificationType } from "../../types";

export const COMMON_NOTIFICATION_TYPES: { [key: string]: AppNotificationType } =
  {
    approve: {
      type: "approve",
      message: "Approve {name} ({symbol}) to trade",
      id: "approve.name.symbol.to.trade",
    },
    unwrap: {
      type: "unwrap",
      message: "Approve {name} ({symbol}) to trade",
      id: "approve.name.symbol.to.trade",
    },
    wrap: {
      type: "wrap",
      message: "Approve {name} ({symbol}) to trade",
      id: "approve.name.symbol.to.trade",
    },
    swap: {
      type: "swap",
      message: "Swap {sellAmount} {sellSymbol} for {buyAmount} {buySymbol}",
      id: "swap.notification",
    },
    transfer: {
      type: "transfer",
      message: "Swap {sellAmount} {sellSymbol} for {buyAmount} {buySymbol}",
      id: "swap.notification",
    },
  };
