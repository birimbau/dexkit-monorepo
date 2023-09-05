import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";

export const DAI_TOKEN: Token = {
  contractAddress: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
  chainId: ChainId.Polygon,
  decimals: 6,
  name: "DAI",
  symbol: "DAI",
};

export const USDT_TOKEN: Token = {
  contractAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Polygon,
};

export const KIT_TOKEN: Token = {
  contractAddress: "0x4d0def42cf57d6f27cd4983042a55dce1c9f853c",
  decimals: 18,
  name: "DexKit",
  symbol: "KIT",
  coingeckoId: "dexkit",
  chainId: ChainId.Polygon,
};

export const WMATIC_TOKEN: Token = {
  chainId: ChainId.Mumbai,
  name: "Wrapped Matic",
  symbol: "WMATIC",
  contractAddress: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  decimals: 18,
};

export const DUMMY_TOKEN: Token = {
  chainId: ChainId.Mumbai,
  contractAddress: "0xfe4f5145f6e09952a5ba9e956ed0c25e3fa4c7f1",
  name: "DERC20",
  symbol: "DERC20",
  decimals: 18,
};

export const DEFAULT_BASE_TOKENS = {
  [ChainId.Polygon]: [DAI_TOKEN, USDT_TOKEN],
};

export const DEFAULT_QUOTE_TOKENS = {
  [ChainId.Polygon]: [KIT_TOKEN],
};
