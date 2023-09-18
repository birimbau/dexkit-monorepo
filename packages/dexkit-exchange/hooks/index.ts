import { ChainId } from "@dexkit/core";
import { ethers } from "ethers";

import { BigNumber } from "bignumber.js";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createZrxOrder } from "../utils";

import {
  ZEROEX_ORDERBOOK_ENDPOINT,
  ZERO_EX_URL,
} from "@dexkit/core/services/zrx/constants";
import { Token } from "@dexkit/core/types";
import axios from "axios";
import { useCallback, useContext, useState } from "react";
import { DexkitExchangeContext } from "../contexts";
import { getGeckoTerminalTopPools } from "../services";
import { DexkitExchangeContextState, GtPool } from "../types";

export function useExchangeContext() {
  return useContext(DexkitExchangeContext);
}

export function useSendLimitOrderMutation() {
  const context = useExchangeContext();

  return useMutation(
    async ({
      expirationTime,
      makerAmount,
      makerToken,
      provider,
      takerAmount,
      takerToken,
      chainId,
      maker,
    }: {
      expirationTime: number;
      makerAmount: string;
      makerToken: string;
      provider: ethers.providers.Web3Provider;
      takerAmount: string;
      takerToken: string;
      chainId: ChainId;
      maker?: string;
    }) => {
      if (!maker) {
        return null;
      }

      const signedOrder = await createZrxOrder({
        maker,
        chainId,
        expirationTime,
        makerAmount: new BigNumber(makerAmount),
        makerToken,
        provider,
        takerAmount: new BigNumber(takerAmount),
        takerToken,
      });

      const resp = await axios.post(
        `${ZERO_EX_URL(chainId)}/${ZEROEX_ORDERBOOK_ENDPOINT}`,
        signedOrder,
        context.zrxApiKey
          ? { headers: { "0x-api-key": context.zrxApiKey } }
          : undefined
      );

      return resp.data;
    }
  );
}

const GETCKO_TERMINAL_TOP_POOLS_QUERY = "GETCKO_TERMINAL_TOP_POOLS_QUERY";

export function useGeckoTerminalTopPools({
  network,
  address,
}: {
  network?: string;
  address?: string;
}) {
  return useQuery<GtPool[] | null>(
    [GETCKO_TERMINAL_TOP_POOLS_QUERY, network, address],
    async () => {
      if (!address || !network) {
        return null;
      }

      const resp = await getGeckoTerminalTopPools({ address, network });

      return resp.data.data;
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
}

export function useExchangeContextState(params: {
  baseTokens: Token[];
  quoteTokens: Token[];
  baseToken?: Token;
  quoteToken?: Token;
  buyTokenPercentageFee?: number;
  affiliateAddress?: string;
  feeRecipient?: string;
  zrxApiKey?: string;
}): DexkitExchangeContextState {
  const [quoteToken, setQuoteToken] = useState<Token | undefined>(
    params?.quoteToken
  );
  const [baseToken, setBaseToken] = useState<Token | undefined>(
    params?.baseToken
  );

  const [quoteTokens, setQuoteTokens] = useState<Token[]>(params.quoteTokens);
  const [baseTokens, setBaseTokens] = useState<Token[]>(params.baseTokens);

  const handleSetPair = useCallback((base: Token, quote: Token) => {
    setQuoteToken(quote);
    setBaseToken(base);
  }, []);

  return {
    setPair: handleSetPair,
    baseToken,
    quoteToken,
    baseTokens,
    quoteTokens,
    tokens: {},
    feeRecipient: params.feeRecipient,
    affiliateAddress: params.affiliateAddress,
    buyTokenPercentageFee: params.buyTokenPercentageFee,
    zrxApiKey: params.zrxApiKey
      ? params.zrxApiKey
      : process.env.NEXT_PUBLIC_ZRX_API_KEY,
  };
}
