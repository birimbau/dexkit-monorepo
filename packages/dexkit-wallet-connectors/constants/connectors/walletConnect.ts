import { NETWORKS } from "@dexkit/core/constants/networks";
import { initializeConnector } from "@web3-react/core";
import { WalletConnect, WalletConnectConstructorArgs } from "@web3-react/walletconnect-v2";



const rpcs: { [key: number]: string } = {};
const chains: number[] = [];
for (const key in NETWORKS) {
  if (NETWORKS[key].providerRpcUrl) {
    rpcs[key] = NETWORKS[key].providerRpcUrl as string;
    chains.push(NETWORKS[key].chainId)
  }
}

export class WalletConnectV2 extends WalletConnect {
  constructor({
    actions,
    defaultChainId,
    qrcode = true,
    onError,
  }: Omit<WalletConnectConstructorArgs, 'options'> & { defaultChainId: number; qrcode?: boolean }) {
    let darkmode = false;
    if (typeof window !== "undefined") {
      darkmode = Boolean(window.matchMedia('(prefers-color-scheme: dark)'))
    }

    super({
      actions,
      options: {
        projectId: 'bcd1271357ab9202f271bc908324aff6',
        chains: [defaultChainId],

        optionalChains: chains,
        rpcMap: rpcs,
        showQrModal: qrcode,
        // as of 6/16/2023 there are no docs for `optionalMethods`
        // this set of optional methods fixes a bug we encountered where permit2 signatures were never received from the connected wallet
        // source: https://uniswapteam.slack.com/archives/C03R5G8T8BH/p1686858618164089?thread_ts=1686778867.145689&cid=C03R5G8T8BH
        optionalMethods: ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign'],
        qrModalOptions: {
          desktopWallets: undefined,
          enableExplorer: true,
          explorerExcludedWalletIds: undefined,
          explorerRecommendedWalletIds: undefined,
          mobileWallets: undefined,
          privacyPolicyUrl: undefined,
          termsOfServiceUrl: undefined,
          themeMode: darkmode ? 'dark' : 'light',
          themeVariables: {
            '--wcm-font-family': '"Inter custom", sans-serif',
            '--wcm-z-index': '5000',
          },
          walletImages: undefined,
        },
      },
      onError,
    })
  }

  activate(chainId?: number) {

    return super.activate(chainId)
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
