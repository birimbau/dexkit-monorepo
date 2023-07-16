import { WalletActivateParams } from "@dexkit/core/types";
import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";
import { getIsCoinbaseWallet, getIsInjected, getIsMetaMaskWallet } from "./constants/connectors/utils";
import { MagicLoginType } from "./types/magic";
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
    {
      id: "magic",
      name: "Discord",
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/discord-logo.svg",
      loginType: "discord",
      shouldDisplay: () => !getIsInjectedMobileBrowser(),
    },
  ];

export function GET_CONNECTOR_NAME(connector: any) {
  if (connector instanceof MetaMask) return 'MetaMask';
  if (connector instanceof WalletConnect) return 'WalletConnect';
  if (connector instanceof Connector) {
    if (typeof window !== "undefined") {
      const loginType = localStorage.getItem("loginType");
      return WALLET_CONNECTORS.find(w => w.id === 'magic' && w.loginType === loginType)?.name
    }
  }
  return 'Unknown';
}

export function GET_WALLET_ICON(connector: any) {
  if (connector instanceof MetaMask) return 'https://raw.githubusercontent.com/DexKit/assets/main/metamask-fox.svg';
  if (connector instanceof WalletConnect) return 'https://raw.githubusercontent.com/DexKit/assets/main/walletconnect-circle-blue.svg';
  if (connector instanceof Connector) {
    if (typeof window !== "undefined") {
      const loginType = localStorage.getItem("loginType");
      return WALLET_CONNECTORS.find(w => w.id === 'magic' && w.loginType === loginType)?.icon
    }
  }


  return undefined;
}

