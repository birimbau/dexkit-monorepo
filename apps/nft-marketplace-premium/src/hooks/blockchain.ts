import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  switchNetworkChainIdAtom,
  switchNetworkOpenAtom,
  tokensAtom
} from '../state/atoms';
import {
  getNativeCurrencyImage,
  getNativeCurrencySymbol,
  getProviderByChainId,
  switchNetwork
} from '../utils/blockchain';

import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '../constants';
import { Token } from '../types/blockchain';

import { NETWORKS } from '../constants/chain';

import { EvmCoin } from '@dexkit/core/types';
import { convertTokenToEvmCoin } from '@dexkit/core/utils';

import { ChainId, CoinTypes } from '@dexkit/core/constants';
import { parse, ParseOutput } from 'eth-url-parser';
import { ethers } from 'ethers';
import { getTokenData } from '../services/blockchain';
import { useAppConfig } from './app';
export function useEvmCoins({ defaultChainId }: { defaultChainId?: ChainId }): EvmCoin[] {
  const { chainId: walletChainId } = useWeb3React();
  const chainId = defaultChainId || walletChainId;
  const tokens = useTokenList({ chainId, includeNative: true });

  return useMemo(() => tokens.map(convertTokenToEvmCoin), [tokens])

}

export function useBlockNumber() {
  const { provider } = useWeb3React();

  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    if (provider) {
      const handleBlockNumber = (blockNumber: any) => {
        setBlockNumber(blockNumber);
      };

      provider?.on('block', handleBlockNumber);

      return () => {
        provider?.removeListener('block', handleBlockNumber);
      };
    }
  }, [provider]);

  return blockNumber;
}

export function useSwitchNetwork() {
  const setSwitchOpen = useUpdateAtom(switchNetworkOpenAtom);
  const setSwitchChainId = useUpdateAtom(switchNetworkChainIdAtom);

  const openDialog = useCallback((chainId: number) => {
    setSwitchOpen(true);
    setSwitchChainId(chainId);
  }, []);

  return {
    openDialog,
  };
}

export function useSwitchNetworkMutation() {
  const { connector } = useWeb3React();

  return useMutation<unknown, Error, { chainId: number }>(
    async ({ chainId }) => {
      if (connector) {
        return switchNetwork(connector, chainId);
      }
    }
  );
}

export function useTokenList({
  chainId,
  includeNative = false,
  onlyTradable,
  onlyNative
}: {
  chainId?: number;
  includeNative?: boolean;
  onlyNative?: boolean;
  onlyTradable?: boolean;
}) {
  const appConfig = useAppConfig();

  const tokensValues = useAtomValue(tokensAtom);

  const tokenListJson = useMemo(() => {
    if (appConfig.tokens?.length === 1) {
      return appConfig.tokens[0].tokens;
    }

    return [];
  }, [appConfig]);

  // TODO: do the right logic
  let tokens = [...tokensValues, ...tokenListJson];

  if (onlyTradable) {
    tokens = tokens.filter((t) => Boolean(t.tradable));
  }

  return useMemo(() => {
    if (chainId === undefined) {
      return [] as Token[];
    }
    if (onlyNative) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: getNativeCurrencyImage(chainId),
          name: getNativeCurrencySymbol(chainId),
          symbol: getNativeCurrencySymbol(chainId),
        }
      ] as Token[];
    }


    let tokenList: Token[] = [
      ...tokens.filter((token: Token) => token.chainId === chainId),
    ];

    const wrappedAddress = NETWORKS[chainId]?.wrappedAddress;
    const isNoWrappedTokenInList =
      tokenList &&
      tokenList.findIndex((t) => t.address.toLowerCase() === wrappedAddress) ===
      -1;
    // Wrapped Token is not on the list, we will add it here
    if (wrappedAddress && isNoWrappedTokenInList) {
      tokenList = [
        {
          address: wrappedAddress,
          chainId,
          decimals: 18,
          logoURI: getNativeCurrencyImage(chainId),
          name: `Wrapped ${getNativeCurrencySymbol(chainId)}`,
          symbol: `W${getNativeCurrencySymbol(chainId)}`,
        } as Token,
        ...tokenList,
      ];
    }

    if (includeNative) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: getNativeCurrencyImage(chainId),
          name: getNativeCurrencySymbol(chainId),
          symbol: getNativeCurrencySymbol(chainId),
        },
        ...tokenList,
      ] as Token[];
    }

    return [...tokenList] as Token[];
  }, [chainId, onlyNative, includeNative]);
}

export function useTokenData(options?: Omit<UseMutationOptions, any>) {
  return useMutation(
    async ({ chainId, address }: { chainId: number; address: string }) => {
      return await getTokenData(chainId, address);
    },
    options
  );
}

export function useNetworkProvider(chainId?: ChainId) {
  return getProviderByChainId(chainId);
}


export function useParsePaymentRequest({ paymentURL }: { paymentURL?: string }) {
  const paymentUrlParsed = useMemo(() => {
    if (paymentURL) {
      const parsedPayment = parse(paymentURL);
      let url: {
        chainId?: ChainId,
        to?: string,
        parsedOutput?: ParseOutput
      } = {};
      if (parsedPayment) {
        url.parsedOutput = parsedPayment
      }

      if (parsedPayment.chain_id) {
        url.chainId = Number(parsedPayment.chain_id);
      }
      if (parsedPayment.function_name === 'transfer') {
        if (parsedPayment.parameters && parsedPayment.parameters['address']) {
          url.to = parsedPayment.parameters['address']
        }
      } else {
        if (parsedPayment.function_name === undefined) {
          if (parsedPayment.target_address) {
            url.to = parsedPayment.target_address;
          }
        }
      }
      return url;
    }
  }, [paymentURL])


  const evmCoins = useEvmCoins({ defaultChainId: paymentUrlParsed?.chainId });

  const defaultCoin = useMemo(() => {
    if (paymentUrlParsed?.parsedOutput && evmCoins) {
      let defaultCoin;
      if (paymentUrlParsed.parsedOutput.function_name === 'transfer') {
        if (paymentUrlParsed.chainId && paymentUrlParsed.parsedOutput.target_address) {
          const contractAddress = paymentUrlParsed.parsedOutput.target_address.toLowerCase();
          defaultCoin = evmCoins.
            filter(e => e.coinType === CoinTypes.EVM_ERC20).find(c => {
              if (c.coinType === CoinTypes.EVM_ERC20) {
                return c.contractAddress.toLowerCase() === contractAddress && paymentUrlParsed.chainId === c.network.chainId
              }
            })
        }
      }
      if (paymentUrlParsed.parsedOutput.function_name === undefined) {
        defaultCoin = evmCoins.find(c => c.coinType === CoinTypes.EVM_NATIVE && c.network.chainId === paymentUrlParsed.chainId);
      }
      return defaultCoin
    }
  }, [paymentUrlParsed, evmCoins])
  const amount = useMemo(() => {
    if (defaultCoin && paymentUrlParsed?.parsedOutput) {
      let amount;
      const parsedPayment = paymentUrlParsed?.parsedOutput;

      if (parsedPayment.function_name === 'transfer') {
        if (parsedPayment.parameters && parsedPayment.parameters['uint256'] && defaultCoin.decimals !== undefined) {
          amount = ethers.utils.formatUnits(parsedPayment.parameters['uint256'], defaultCoin.decimals)
        }
      }
      if (parsedPayment.function_name === undefined) {
        if (parsedPayment.parameters && parsedPayment.parameters['value']) {
          amount = ethers.utils.formatEther(parsedPayment.parameters['value'])

        }
      }
      return amount;
    }

  }, [defaultCoin])
  return {
    ...paymentUrlParsed,
    amount,
    defaultCoin
  }
}

