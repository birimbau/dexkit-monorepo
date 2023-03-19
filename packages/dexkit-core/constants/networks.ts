import { Network } from "../types";
import { ChainId } from "./enums";

export const NETWORKS: { [key: number]: Network } = {
  [ChainId.Ethereum]: {
    chainId: ChainId.Ethereum,
    symbol: "ETH",
    explorerUrl: "https://etherscan.io",
    name: "Ethereum",
    slug: "ethereum",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
    providerRpcUrl: `https://eth.llamarpc.com`,
  },
  [ChainId.Optimism]: {
    chainId: ChainId.Optimism,
    symbol: "OP",
    coinName: "Ethereum",
    coinSymbol: 'ETH',
    coinImageUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    explorerUrl: "https://optimistic.etherscan.io",
    name: "Optimism",
    slug: "optimism",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0x4200000000000000000000000000000000000006",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
    providerRpcUrl: "https://rpc.ankr.com/optimism",
  },
  [ChainId.BSC]: {
    chainId: ChainId.BSC,
    symbol: "BNB",
    coinName: 'Binance Coin',
    explorerUrl: "https://bscscan.com",
    name: "Smart Chain",
    slug: "bsc",
    coingeckoPlatformId: "binancecoin",
    wrappedAddress: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    providerRpcUrl: "https://bscrpc.com",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png",
  },
  [ChainId.Polygon]: {
    chainId: ChainId.Polygon,
    symbol: "MATIC",
    explorerUrl: "https://polygonscan.com",
    name: "Polygon",
    slug: "polygon",
    coingeckoPlatformId: "matic-network",
    wrappedAddress: `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270`,
    providerRpcUrl: `https://poly-rpc.gateway.pokt.network`,
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
  },
  [ChainId.Fantom]: {
    chainId: ChainId.Fantom,
    symbol: "FTM",
    explorerUrl: "https://ftmscan.com",
    name: "Fantom",
    slug: "fantom",
    coingeckoPlatformId: "fantom",
    wrappedAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png",
    providerRpcUrl: "https://rpc.ftm.tools",
  },
  [ChainId.Arbitrum]: {
    chainId: ChainId.Arbitrum,
    symbol: "ARB",
    coinName: "Ethereum",
    coinSymbol: 'ETH',
    coinImageUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    explorerUrl: "https://arbiscan.io",
    name: "Arbitrum",
    slug: "arbitrum",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
    providerRpcUrl: "https://rpc.ankr.com/arbitrum",
  },



  [ChainId.Avax]: {
    chainId: ChainId.Avax,
    symbol: "AVAX",
    explorerUrl: "https://snowtrace.io",
    name: "Avalanche",
    slug: "avalanche",
    coingeckoPlatformId: "avalanche-2",
    wrappedAddress: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    providerRpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
  },

  [ChainId.Goerli]: {
    chainId: ChainId.Goerli,
    symbol: "GoerliETH",
    explorerUrl: "https://goerli.etherscan.io/",
    name: "Goerli",
    slug: "goerli",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
    providerRpcUrl: "https://endpoints.omniatech.io/v1/eth/goerli/public",
    testnet: process.env.NODE_ENV !== "development",
  },
  [ChainId.Mumbai]: {
    chainId: ChainId.Mumbai,
    symbol: "MATIC",
    explorerUrl: "https://mumbai.polygonscan.com",
    name: "Mumbai",
    slug: "mumbai",
    wrappedAddress: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
    providerRpcUrl: `https://rpc.ankr.com/polygon_mumbai`,
    testnet: process.env.NODE_ENV !== "development",
  },
};

export const NETWORK_SYMBOL = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId] ? NETWORKS[chainId].symbol : undefined;

export const NETWORK_COIN_SYMBOL = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId] ? NETWORKS[chainId]?.coinSymbol ? NETWORKS[chainId]?.coinSymbol : NETWORKS[chainId].symbol : undefined;

