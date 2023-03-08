import { ChainConfig } from '@dexkit/widgets/src/widgets/swap/types';

export interface SwapConfig {
  defaultChainId?: number;
  defaultEditChainId?: number;
  configByChain?: {
    [chain: number]: ChainConfig;
  };
}
