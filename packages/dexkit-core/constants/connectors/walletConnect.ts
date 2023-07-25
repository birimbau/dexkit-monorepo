import { initializeConnector } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect";
import { NETWORKS } from "../../constants/networks";


const rpcs: { [key: number]: string } = {};

for (const key in NETWORKS) {
  if (NETWORKS[key].providerRpcUrl) {
    rpcs[key] = NETWORKS[key].providerRpcUrl as string;
  }
}

export const [walletConnect, walletConnectHooks] =
  initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          rpc: rpcs,
        },
      })
  );
