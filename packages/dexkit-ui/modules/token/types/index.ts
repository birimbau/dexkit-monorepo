import type { OrderMarketType } from '@dexkit/exchange/constants';


export interface MarketTradeConfig {
  showTokenDetails?: boolean;
  show?: OrderMarketType;
  baseTokenConfig?: {
    chainId?: number,
    address?: string
  }
  slippage?: number;
}
