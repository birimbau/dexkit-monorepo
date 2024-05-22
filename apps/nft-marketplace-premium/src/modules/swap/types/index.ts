import { ChainConfig } from '@dexkit/widgets/src/widgets/swap/types';

export interface SwapConfig {
  useGasless?: boolean;
  myTokensOnlyOnSearch?: boolean;
  defaultChainId?: number;
  defaultEditChainId?: number;
  configByChain?: {
    [chain: number]: ChainConfig;
  };
}
