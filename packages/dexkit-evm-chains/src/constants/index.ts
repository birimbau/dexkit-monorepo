import CHAIN_IDS from './chainIds.json';
import CHAINS from "./chains.json";
import COINGECKO_IDS_JSON from "./coingeckoIds.json";
export const DKAPI_INVALID_ADDRESSES = [
  "0x0000000000000000000000000000000000001010",
];

export const MULTICALL_NATIVE_TOKEN_ADDRESS =
  '0x0000000000000000000000000000000000000000';


export const SUPPORTED_DEXAPPBUILDER_CHAIN_IDS = [CHAIN_IDS.Ethereum_Mainnet, CHAIN_IDS.Arbitrum_One, CHAIN_IDS.Avalanche_C_Chain, CHAIN_IDS.OP_Mainnet, CHAIN_IDS.BNB_Smart_Chain_Mainnet, CHAIN_IDS.Fantom_Opera, CHAIN_IDS.Polygon_Mainnet, CHAIN_IDS.Base, CHAIN_IDS.Mumbai, CHAIN_IDS.Goerli];

/**Chain Ids that DexAppBuilder supported before */
export const SUPPORTED_LEGACY_CHAIN_IDS = [CHAIN_IDS.Ethereum_Mainnet, CHAIN_IDS.Arbitrum_One, CHAIN_IDS.Avalanche_C_Chain, CHAIN_IDS.OP_Mainnet, CHAIN_IDS.BNB_Smart_Chain_Mainnet, CHAIN_IDS.Fantom_Opera, CHAIN_IDS.Polygon_Mainnet, CHAIN_IDS.Base, CHAIN_IDS.Mumbai, CHAIN_IDS.Goerli]


export const DEFAULT_DEXAPPBUILDER_NETWORKS = CHAINS.filter(ch => SUPPORTED_DEXAPPBUILDER_CHAIN_IDS.includes(ch.chainId));

export const EVM_CHAINS = CHAINS;

export const COINGECKO_IDS = COINGECKO_IDS_JSON;

export const WRAPPED_TOKEN_ADDRESSES: { [key: number]: string } = {
  [CHAIN_IDS.Ethereum_Mainnet]: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  [CHAIN_IDS.Arbitrum_One]: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  [CHAIN_IDS.OP_Mainnet]: "0x4200000000000000000000000000000000000006",
  [CHAIN_IDS.Avalanche_C_Chain]: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
  [CHAIN_IDS.BNB_Smart_Chain_Mainnet]: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  [CHAIN_IDS.Fantom_Opera]: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
  [CHAIN_IDS.Polygon_Mainnet]: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  [CHAIN_IDS.Base]: "0x4200000000000000000000000000000000000006",
  [CHAIN_IDS.Mumbai]: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
  [CHAIN_IDS.Goerli]: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
}


export const enum NETWORK_ID {
  Ethereum = 'ethereum',
  Goerli = 'goerli',
  Mumbai = 'mumbai',
  Polygon = 'polygon',
  BSC = 'bsc',
  Avalanche = 'avalanche',
  Fantom = 'fantom',
  Optimism = 'optimism',
  Arbitrum = 'arbitrum',
  Base = 'base'
}

export const SLUG_OVERLAP: { [key: number]: string } = {
  [CHAIN_IDS.Ethereum_Mainnet]: 'ethereum',
  [CHAIN_IDS.Arbitrum_One]: 'arbitrum',
  [CHAIN_IDS.OP_Mainnet]: 'optimism',
  [CHAIN_IDS.Avalanche_C_Chain]: 'avalanche',
  [CHAIN_IDS.BNB_Smart_Chain_Mainnet]: 'bsc',
  [CHAIN_IDS.Fantom_Opera]: 'fantom',
  [CHAIN_IDS.Polygon_Mainnet]: 'polygon',
  [CHAIN_IDS.Base]: 'base',
  [CHAIN_IDS.Mumbai]: 'mumbai',
  [CHAIN_IDS.Goerli]: 'goerli'
}
export const PROVIDER_OVERLAP: { [key: number]: string } = {
  [CHAIN_IDS.Ethereum_Mainnet]: 'ethereum',
  [CHAIN_IDS.Arbitrum_One]: 'arbitrum',
  [CHAIN_IDS.OP_Mainnet]: 'optimism',
  [CHAIN_IDS.Avalanche_C_Chain]: 'avalanche',
  [CHAIN_IDS.BNB_Smart_Chain_Mainnet]: 'bsc',
  [CHAIN_IDS.Fantom_Opera]: 'fantom',
  [CHAIN_IDS.Polygon_Mainnet]: 'polygon',
  [CHAIN_IDS.Base]: 'base',
  [CHAIN_IDS.Mumbai]: 'mumbai',
  [CHAIN_IDS.Goerli]: 'goerli'
}
