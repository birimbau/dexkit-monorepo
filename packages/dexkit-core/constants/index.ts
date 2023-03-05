import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { metaMask, metaMaskHooks } from "./connectors/metamask";
import { walletConnect, walletConnectHooks } from "./connectors/walletConnect";

export type MagicLoginType = "email" | "google" | "twitter";

export const CONNECTORS: { [key: string]: [Connector, Web3ReactHooks] } = {
  metamask: [metaMask, metaMaskHooks],
  walletConnect: [walletConnect, walletConnectHooks]
  // magic: [magic, magicHooks],
};

export * from "./enums";
