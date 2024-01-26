import { Network } from "@dexkit/core/types";
import { initializeConnector } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect-v2";

export function initWalletConnector({
  NETWORKS,
}: {
  NETWORKS?: { [key: number]: Network };
}) {
  if (!NETWORKS) {
    return [];
  }

  const rpcs: { [key: number]: string } = {};

  const chains: number[] = [];

  for (const key in NETWORKS) {
    if (NETWORKS[key].providerRpcUrl) {
      rpcs[key] = NETWORKS[key].providerRpcUrl as string;
      chains.push(NETWORKS[key].chainId);
    }
  }

  const result = initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          chains: [1],
          optionalChains: chains,
          rpcMap: rpcs,
          showQrModal: true,
          // TODO: put on env variable
          projectId: "bcd1271357ab9202f271bc908324aff6",
          qrModalOptions: {
            desktopWallets: undefined,
            enableExplorer: true,
            explorerExcludedWalletIds: undefined,
            explorerRecommendedWalletIds: undefined,
            mobileWallets: undefined,
            privacyPolicyUrl: undefined,
            termsOfServiceUrl: undefined,
            themeMode: "dark",

            walletImages: undefined,
            themeVariables: {
              "--wcm-z-index": "5000",
            },
          },
        },
      })
  );
  return result;
}

export const [walletConnect, walletConnectHooks] = initWalletConnector({
  NETWORKS: {},
});
