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

export const USDT_TOKEN_ETH: Token = {
  contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Ethereum,
};

export const USDT_TOKEN_AVAX: Token = {
  contractAddress: "0xde3a24028580884448a5397872046a019649b084",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Avax,
};

export const USDT_TOKEN_BSC: Token = {
  contractAddress: "0x55d398326f99059ff775485246999027b3197955",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.BSC,
};

export const USDT_TOKEN_ARB: Token = {
  contractAddress: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Arbitrum,
};

export const USDT_TOKEN_OPTMISM: Token = {
  contractAddress: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Optimism,
};

export const DAI_TOKEN_BSC: Token = {
  contractAddress: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
  decimals: 6,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.BSC,
};

export const DAI_TOKEN_OPT: Token = {
  contractAddress: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
  decimals: 6,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Optimism,
};

export const DAI_TOKEN_POLYGON: Token = {
  contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  decimals: 6,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Polygon,
};

export const DAI_TOKEN_FANTOM: Token = {
  contractAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
  decimals: 6,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Fantom,
};

export const DAI_TOKEN_AVAX: Token = {
  contractAddress: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  decimals: 6,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Avax,
};

export const DAI_TOKEN_ETH: Token = {
  contractAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  decimals: 6,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Ethereum,
};

export const USDC_TOKEN_ETH: Token = {
  contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.Ethereum,
};

export const USDC_TOKEN_BSC: Token = {
  contractAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.BSC,
};

export const USDC_TOKEN_FANTOM: Token = {
  contractAddress: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.Fantom,
};

export const USDC_TOKEN_POLYGON: Token = {
  contractAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.Polygon,
};

export const USDC_TOKEN_AVAX: Token = {
  contractAddress: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.Avax,
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

export const QUOTE_TOKENS_SUGGESTION = [
  USDT_TOKEN_ETH,
  USDT_TOKEN_ARB,
  USDT_TOKEN_AVAX,
  USDT_TOKEN_OPTMISM,
  USDT_TOKEN_BSC,

  DAI_TOKEN_ETH,
  DAI_TOKEN_AVAX,
  DAI_TOKEN_FANTOM,
  DAI_TOKEN_OPT,
  DAI_TOKEN_POLYGON,
  DAI_TOKEN_BSC,

  USDC_TOKEN_ETH,
  USDC_TOKEN_POLYGON,
  USDC_TOKEN_FANTOM,
  USDC_TOKEN_BSC,
  USDC_TOKEN_AVAX,
];
