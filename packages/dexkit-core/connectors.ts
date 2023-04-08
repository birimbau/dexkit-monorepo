import { WalletActivateParams } from "@dexkit/core/types";
import { MagicLoginType } from "./constants";
import { getIsCoinbaseWallet, getIsInjected, getIsMetaMaskWallet } from "./constants/connectors/utils";
import { isMobile } from "./utils/userAgent";
//@dev https://github.com/Uniswap/interface/blob/main/src/connection/index.ts
const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet()
const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet()
const getIsGenericInjector = () => getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet();
const getIsInjectedMobileBrowser = () => getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser()

export const WALLET_CONNECTORS: {
  id: WalletActivateParams['connectorName'];
  name: string;
  icon: string;
  loginType?: MagicLoginType;
  shouldDisplay: () => boolean;
}[] = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/metamask-fox.svg",
      shouldDisplay: () => getIsMetaMaskWallet() || getIsGenericInjector(),
    },
    {
      id: "walletConnect",
      name: "Wallet Connect",
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/walletconnect-circle-blue.svg",
      shouldDisplay: () => !getIsInjectedMobileBrowser(),
    },
    {
      id: "magic",
      name: "Google",
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/google-icon.svg",
      loginType: "google",
      shouldDisplay: () => !getIsInjectedMobileBrowser(),
    },
    {
      id: "magic",
      name: "Twitter",
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/twitter-logo.svg",
      loginType: "twitter",
      shouldDisplay: () => !getIsInjectedMobileBrowser(),
    },
  ];


