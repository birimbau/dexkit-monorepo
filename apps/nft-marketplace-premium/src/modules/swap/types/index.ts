import { Token } from "src/types/blockchain";

export interface SwapConfig {
  defaultChainId?: number;
  defaultEditChainId?: number;
  configByChain?: {
    [chain: number]: {
      defaultSellToken?: Token;
      defaultBuyToken?: Token;
      slippage?: number;
    };
  };
}