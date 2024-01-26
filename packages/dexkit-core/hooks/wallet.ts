import { useQuery } from "@tanstack/react-query";
import { Token } from "../types";

import { ChainId } from "../constants";
import { getPricesByChain } from "../services";

export const COIN_PRICES_QUERY = "COIN_PRICES_QUERY";

export function useCoinPrices({
  currency,
  tokens,
  chainId,
}: {
  tokens?: Token[];
  chainId?: ChainId;
  currency?: string;
}) {
  return useQuery([COIN_PRICES_QUERY, chainId, tokens, currency], async () => {
    if (!chainId || !tokens || !currency) {
      return;
    }

    return await getPricesByChain(chainId, tokens, currency);
  });
}
