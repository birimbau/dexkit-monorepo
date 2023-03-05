import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';
//TODO: Unify networks between both apps
import { NETWORKS } from '../../../../apps/nft-marketplace-premium/src/constants/chain';


const rpcs: { [key: number]: string } = {}

for (const key in NETWORKS) {
  if (NETWORKS[key].providerRpcUrl) {
    rpcs[key] = NETWORKS[key].providerRpcUrl as string
  }
}

export const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: rpcs,
    }),
  Object.keys(NETWORKS).map(c => Number(c))
);
