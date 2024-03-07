import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";


import { coinbaseWalletConnection, deprecatedInjectedConnection, magic, magicHooks, walletConnectV2Connection } from "../connectors/connections";

export const CONNECTORS: { [key: string]: [Connector, Web3ReactHooks] } = {
  metamask: [deprecatedInjectedConnection.connector, deprecatedInjectedConnection.hooks],
  walletConnect: [walletConnectV2Connection.connector, walletConnectV2Connection.hooks],
  magic: [magic, magicHooks],
  coinbase: [coinbaseWalletConnection.connector, coinbaseWalletConnection.hooks]
};