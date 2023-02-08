import { Token } from "../types";
import { DkApiPlatformCoin } from "../types/api";

export function apiCoinToTokens(coins?: DkApiPlatformCoin[]): Token[] {
  if (!coins) {
    return [];
  }

  return coins.map((c) => ({
    chainId: c.chainId,
    contractAddress: c.address,
    decimals: c.decimals,
    name: c.coin?.name ?? "",
    symbol: c.coin?.symbol ?? "",
    coingeckoId: c.platformId,
    logoURI: c.coin?.logoUrl,
  }));
}
