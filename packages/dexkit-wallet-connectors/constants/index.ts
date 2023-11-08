import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { metaMask, metaMaskHooks } from "./connectors/metamask";
import { walletConnect, walletConnectHooks } from "./connectors/walletConnect";


import { magic, magicHooks } from "./connectors/magic";

export const CONNECTORS: { [key: string]: [Connector, Web3ReactHooks] } = {
  metamask: [metaMask, metaMaskHooks],
  walletConnect: [walletConnect, walletConnectHooks],
  magic: [magic, magicHooks],
};