import type { providers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { useActiveAccount, useActiveWallet, useActiveWalletChain, useActiveWalletConnectionStatus } from "thirdweb/react";
import { THIRDWEB_CLIENT_ID } from "../constants/thirdweb";
export function useWeb3React() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const chain = useActiveWalletChain();
  const status = useActiveWalletConnectionStatus();
  const [ENSName, setENSName] = useState<string | null>()


  const provider = useMemo(() => {
    if (chain?.id) {
      const client = createThirdwebClient({ clientId: THIRDWEB_CLIENT_ID });
      const chainClient = defineChain(chain?.id)
      return ethers5Adapter.provider.toEthers({ client, chain: chainClient }) as providers.Web3Provider;
    }
  }, [chain?.id])



  useEffect(() => {
    if (chain?.id && account?.address) {
      const client = createThirdwebClient({ clientId: THIRDWEB_CLIENT_ID });
      const chainClient = defineChain(1)
      const provider = ethers5Adapter.provider.toEthers({ client, chain: chainClient }) as providers.Web3Provider;

      provider.lookupAddress(account?.address).then((val) => setENSName(val))

    }
  }, [chain?.id, account?.address])


  return { account: account?.address, chainId: chain?.id, isActive: status === 'connected', provider, ENSName, isActivating: status === 'connecting', wallet }



}