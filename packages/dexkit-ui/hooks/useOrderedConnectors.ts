import { InjectedConnection, connections } from "@dexkit/wallet-connectors/connectors/connections";
import { useWalletConnectorMetadata } from "@dexkit/wallet-connectors/hooks/wallet";
import { ConnectionType } from "@dexkit/wallet-connectors/types";
import type { Web3ReactHooks } from '@web3-react/core';
import { Connector } from "@web3-react/types";
import { useMemo } from "react";

export function useOrderedConnectors() {
  const { walletConnectorMetadata } = useWalletConnectorMetadata();

  return useMemo(() => {
    // We need to put the previous connection always first to Web3React be able to connect eagerly
    if (walletConnectorMetadata) {
      if (walletConnectorMetadata.type === ConnectionType.EIP_6963_INJECTED) {
        const firstConnection = connections.find(c => c.type === ConnectionType.EIP_6963_INJECTED) as InjectedConnection;
        const filteredConnections = connections.filter(c => c.type !== ConnectionType.EIP_6963_INJECTED);
        if (firstConnection) {
          const injectedConnection = firstConnection.wrap({ name: walletConnectorMetadata.name as string, rdns: walletConnectorMetadata.rdns, icon: walletConnectorMetadata.icon });
          if (injectedConnection) {
            return { connectors: [injectedConnection, ...filteredConnections].map<[Connector, Web3ReactHooks]>(({ hooks, connector }) => [connector, hooks]), connectorsKey: 'eip-6963-injected-first' }
          }
        }
      } else {
        if (walletConnectorMetadata.type === ConnectionType.INJECTED) {
          const firstConnection = connections.find(c => c?.type === ConnectionType.INJECTED);
          const filteredConnections = connections.filter(c => c?.type !== ConnectionType.INJECTED);
          if (firstConnection) {
            return { connectors: [firstConnection, ...filteredConnections].map<[Connector, Web3ReactHooks]>(({ hooks, connector }) => [connector, hooks]), connectorsKey: 'injected-first' }
          }
        }
        const firstConnection = connections.find(c => c.getProviderInfo()?.rdns === walletConnectorMetadata?.rdns);
        const filteredConnections = connections.filter(c => c.getProviderInfo()?.rdns !== walletConnectorMetadata?.rdns);
        if (firstConnection) {
          return { connectors: [firstConnection, ...filteredConnections].map<[Connector, Web3ReactHooks]>(({ hooks, connector }) => [connector, hooks]), connectorsKey: 'non-injected-first' }
        }
      }
    }

    return { connectors: connections.map<[Connector, Web3ReactHooks]>(({ hooks, connector }) => [connector, hooks]), connectorsKey: 'default' }

  }, [walletConnectorMetadata]);
}