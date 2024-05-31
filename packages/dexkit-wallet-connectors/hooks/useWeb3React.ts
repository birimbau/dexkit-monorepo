import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { useAccount, useChainId, useConnect, useEnsName } from 'wagmi';
import { useEthersProvider } from "./useEthersProvider";
import { useEthersSigner } from "./useEthersSigner";
/**
 * Starting refactor useWeb3React to make it easy to replace for wagmi or thirdweb
 */
export function useWeb3React() {
  const signerProvider = useEthersSigner();
  const provider = useEthersProvider();
  const { address } = useAccount();
  const chainId = useChainId();
  const { connect, isLoading } = useConnect()
  const { data } = useEnsName({
    address: address,
  })


  const { connector } = useWeb3ReactCore()

  return { account: address, isActive: !!address, connector, chainId, provider: signerProvider ? signerProvider : provider, isActivating: isLoading, ENSName: data }
}