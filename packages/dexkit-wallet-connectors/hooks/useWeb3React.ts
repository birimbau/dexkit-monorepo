import { useWeb3React as useWeb3ReactCore } from "@web3-react/core"

/**
 * Starting refactor useWeb3React to make it easy to replace for wagmi or thirdweb
 */
export function useWeb3React() {
  const { account, isActive, connector, chainId, provider, isActivating, ENSName } = useWeb3ReactCore()

  return { account, isActive, connector, chainId, provider, isActivating, ENSName }
}