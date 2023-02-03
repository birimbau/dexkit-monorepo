import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { ethers } from "ethers";
import { metaMask } from "../connectors";
import { ChainId } from "./enum";
// import { magic, magicHooks } from '../connectors/magic';

export const CONNECTORS: { [key: string]: [Connector, Web3ReactHooks] } = {
  metamask: [metaMask.connector, metaMask.hooks],
  // magic: [magic, magicHooks],
};

export const WRAPED_TOKEN_ADDRESS: { [key: number]: string } = {
  [ChainId.Goerli]: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
};

export function TOKEN_ICON_URL(addr: string, chainId?: ChainId) {
  const address = ethers.utils.getAddress(addr);

  switch (chainId) {
    case ChainId.Ethereum:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
    case ChainId.Polygon:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/${address}/logo.png`;
    case ChainId.Avax:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/assets/${address}/logo.png`;
    case ChainId.BSC:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/${address}/logo.png`;
    case ChainId.Fantom:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/assets/${address}/logo.png`;
    case ChainId.Celo:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/assets/${address}/logo.png`;
    case ChainId.Optimism:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/${address}/logo.png`;
    default:
      return "";
  }
}
