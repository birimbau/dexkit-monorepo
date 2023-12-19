import { Token } from '@dexkit/core/types';
import { ChainConfig } from '@dexkit/widgets/src/widgets/swap/types';

export interface SwapConfig {
  featuredTokens?: Token[]
  defaultChainId?: number;
  defaultEditChainId?: number;
  configByChain?: {
    [chain: number]: ChainConfig;
  };
}
