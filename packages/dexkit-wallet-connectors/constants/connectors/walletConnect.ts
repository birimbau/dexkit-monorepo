import { NETWORKS } from "@dexkit/core/constants/networks";
import { initializeConnector } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect-v2";



const rpcs: { [key: number]: string } = {};
const chains: number[] = [];
for (const key in NETWORKS) {
  if (NETWORKS[key].providerRpcUrl) {
    rpcs[key] = NETWORKS[key].providerRpcUrl as string;
    chains.push(NETWORKS[key].chainId)
  }
}

export const [walletConnect, walletConnectHooks] =
  initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          chains: [1],
          optionalChains: chains,
          rpcMap: rpcs,
          showQrModal: true,
          projectId: 'bcd1271357ab9202f271bc908324aff6',
          qrModalOptions: {
            desktopWallets: undefined,
            enableExplorer: true,
            explorerExcludedWalletIds: undefined,
            explorerRecommendedWalletIds: undefined,
            mobileWallets: undefined,
            privacyPolicyUrl: undefined,
            termsOfServiceUrl: undefined,
            themeMode: 'dark',

            walletImages: undefined,
            themeVariables: {

              '--wcm-z-index': '5000',
            },
          }

        },
      })
  );
