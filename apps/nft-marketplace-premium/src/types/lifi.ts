import { ChainId } from '@dexkit/core';
import { Token } from '@dexkit/core/types';

export type LifiSettings = {
  availNetworks: ChainId[];
  defaultPairs: {
    [key: number]: {
      fromToken: Token;
      toToken: Token;
    };
  };
};
