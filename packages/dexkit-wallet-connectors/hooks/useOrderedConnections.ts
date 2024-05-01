
import { useMemo } from 'react'
import { connectionsList, eip6963Connection } from '../connectors/connections'
import { useInjectedProviderDetails } from '../constants/connectors/eip6963/providers'
import { shouldUseDeprecatedInjector } from '../constants/connectors/utils'
import { Connection, ConnectionType } from '../types'
import { useWalletConnectorMetadata } from './wallet'


export function useEIP6963Connections() {
  const eip6963Injectors = useInjectedProviderDetails()


  return useMemo(() => {
    const eip6963Connections = eip6963Injectors.map((injector) => eip6963Connection.wrap(injector.info)).filter(inj => inj !== undefined) as Connection[]

    // Displays ui to activate window.ethereum for edge-case where we detect window.ethereum !== one of the eip6963 providers
    const showDeprecatedMessage = eip6963Connections.length > 0 && shouldUseDeprecatedInjector(eip6963Injectors)

    return { eip6963Connections, showDeprecatedMessage }
  }, [eip6963Injectors])
}

function mergeConnections(connections: Connection[], eip6963Connections: Connection[]) {
  const hasEip6963Connections = eip6963Connections.length > 0
  const displayedConnections = connections.filter((c) => c.shouldDisplay())

  if (!hasEip6963Connections) return displayedConnections

  const allConnections = [...displayedConnections.filter((c) => c.type !== ConnectionType.INJECTED)]
  // By default, injected options should appear second in the list (below Uniswap wallet)
  allConnections.splice(1, 0, ...eip6963Connections)

  return allConnections
}

// TODO(WEB-3244) Improve ordering logic to make less brittle, as it is spread across connections/index.ts and here
/** Returns an array of all connection Options that should be displayed, where the recent connection is first in the array */
function getOrderedConnections(
  connections: Connection[],
  recentConnection: { type?: string, rdns?: string } | undefined
) {
  const list = []
  for (const connection of connections) {
    if (!connection.shouldDisplay()) continue
    const { name, rdns } = connection.getProviderInfo()

    // For eip6963 injectors, we need to check rdns in addition to connection type to ensure it's the recent connection
    const isRecent = connection.type === recentConnection?.type && (!rdns || rdns === recentConnection.rdns)

    const option = {
      name: name,
      connection: connection,
      isRecent: isRecent
    }

    // Place recent connection at top of list
    isRecent ? list.unshift(option) : list.push(option)
  }

  return list
}

export function useOrderedConnections() {
  const { eip6963Connections } = useEIP6963Connections()
  const recentConnection = useWalletConnectorMetadata()
  const orderedConnections = useMemo(() => {
    const allConnections = mergeConnections(connectionsList, eip6963Connections)
    return getOrderedConnections(allConnections, recentConnection.walletConnectorMetadata)
  }, [eip6963Connections, recentConnection])

  return { orderedConnections }
}