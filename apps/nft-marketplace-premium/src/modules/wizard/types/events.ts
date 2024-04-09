import { ChainId } from '@dexkit/core';

export type SwapUserEvent = {
  txHash: string;
  from: string;
  chainId: ChainId;
  tokenIn: {
    decimals: number;
    name: string;
    symbol: string;
    address: string;
  };
  tokenInAmount: string;
  tokenOut: {
    decimals: number;
    name: string;
    symbol: string;
    address: string;
  };
  tokenOutAmount: string;
};
