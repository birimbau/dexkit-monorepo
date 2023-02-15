import { Network } from "../types";
import { ChainId } from "./enum";

// @ts-ignore
import ethereumIcon from "../../assets/icons/networks/ethereum.png";
// @ts-ignore
import polygonIcon from "../../assets/icons/networks/polygon.png";
// @ts-ignore
import avaxIcon from "../../assets/icons/networks/avax.png";
// @ts-ignore
import bnbIcon from "../../assets/icons/networks/bnb.svg";
// @ts-ignore
import optimismIcon from "../../assets/icons/networks/optimism.svg";
// @ts-ignore
import fantomIcon from "../../assets/icons/networks/fantom.png";

export const NETWORKS: { [key: number]: Network } = {
  [ChainId.Ethereum]: {
    chainId: ChainId.Ethereum,
    symbol: "ETH",
    explorerUrl: "https://etherscan.io",
    name: "Ethereum",
    slug: "ethereum",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    imageUrl: ethereumIcon,
    providerRpcUrl: `https://eth.llamarpc.com`,
  },
  [ChainId.Mumbai]: {
    chainId: ChainId.Mumbai,
    symbol: "MATIC",
    explorerUrl: "https://mumbai.polygonscan.com",
    name: "Mumbai",
    slug: "mumbai",
    wrappedAddress: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
    imageUrl: polygonIcon,
    providerRpcUrl: `https://rpc.ankr.com/polygon_mumbai`,
    testnet: true,
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
    imageUrl: polygonIcon,
  },
  [ChainId.BSC]: {
    chainId: ChainId.BSC,
    symbol: "BNB",
    explorerUrl: "https://bscscan.com",
    name: "Smart Chain",
    slug: "bsc",
    coingeckoPlatformId: "binancecoin",
    wrappedAddress: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    providerRpcUrl: "https://bscrpc.com",
    imageUrl: bnbIcon,
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
    imageUrl: avaxIcon,
  },
  [ChainId.Fantom]: {
    chainId: ChainId.Fantom,
    symbol: "FTM",
    explorerUrl: "https://ftmscan.com",
    name: "Fantom",
    slug: "fantom",
    coingeckoPlatformId: "fantom",
    wrappedAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    imageUrl: fantomIcon,
    providerRpcUrl: "https://rpc.ftm.tools",
  },
  [ChainId.Optimism]: {
    chainId: ChainId.Optimism,
    symbol: "ETH",
    explorerUrl: "https://optimistic.etherscan.io",
    name: "Optimism",
    slug: "optimism",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0x4200000000000000000000000000000000000006",
    imageUrl: optimismIcon,
    providerRpcUrl: "https://mainnet.optimism.io",
  },

  [ChainId.Goerli]: {
    chainId: ChainId.Goerli,
    symbol: "GoerliETH",
    explorerUrl: "https://goerli.etherscan.io/",
    name: "Goerli",
    slug: "goerli",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    imageUrl: ethereumIcon,
    providerRpcUrl: "https://endpoints.omniatech.io/v1/eth/goerli/public",
    testnet: process.env.NODE_ENV !== "development",
  },
};

export const NETWORK_SYMBOL = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId] ? NETWORKS[chainId].symbol : undefined;
