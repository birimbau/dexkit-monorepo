import { ChainId } from "@dexkit/core/constants";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import { EvmCoin, TokenWhitelabelApp } from "@dexkit/core/types";
import { convertTokenToEvmCoin } from "@dexkit/core/utils";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { useAppConfig, useDexKitContext } from ".";
import { useNetworkMetadata } from "./app";

export function useTokenList({
  chainId,
  includeNative = false,
  onlyTradable,
  onlyNative,
}: {
  chainId?: number;
  includeNative?: boolean;
  onlyNative?: boolean;
  onlyTradable?: boolean;
}) {
  const { NETWORKS, NETWORK_IMAGE, NETWORK_NAME, NETWORK_SYMBOL } =
    useNetworkMetadata();

  const appConfig = useAppConfig();

  const tokensValues = useDexKitContext().tokens || [];

  const tokenListJson = useMemo(() => {
    if (appConfig.tokens?.length === 1) {
      return appConfig.tokens[0].tokens ? appConfig.tokens[0].tokens : [];
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
      return [] as TokenWhitelabelApp[];
    }
    if (onlyNative) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: NETWORK_IMAGE(chainId),
          name: NETWORK_NAME(chainId),
          symbol: NETWORK_SYMBOL(chainId),
        },
      ] as TokenWhitelabelApp[];
    }

    let tokenList: TokenWhitelabelApp[] = [
      ...tokens.filter(
        (token: TokenWhitelabelApp) => token.chainId === chainId
      ),
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
          logoURI: NETWORK_IMAGE(chainId),
          name: `Wrapped ${NETWORK_NAME(chainId)}`,
          symbol: `W${NETWORK_SYMBOL(chainId)}`,
        } as TokenWhitelabelApp,
        ...tokenList,
      ];
    }

    if (includeNative) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: NETWORK_IMAGE(chainId),
          name: NETWORK_NAME(chainId),
          symbol: NETWORK_SYMBOL(chainId),
        },
        ...tokenList,
      ] as TokenWhitelabelApp[];
    }

    return [...tokenList] as TokenWhitelabelApp[];
  }, [chainId, onlyNative, includeNative]);
}

export function useEvmCoins({
  defaultChainId,
}: {
  defaultChainId?: ChainId;
}): EvmCoin[] {
  const { chainId: walletChainId } = useWeb3React();
  const chainId = defaultChainId || walletChainId;
  const tokens = useTokenList({ chainId, includeNative: true });
  const { NETWORKS } = useNetworkMetadata();

  return useMemo(
    () => tokens.map((t) => convertTokenToEvmCoin(t, NETWORKS)),
    [tokens]
  );
}
