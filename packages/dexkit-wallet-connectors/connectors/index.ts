
//import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Connector } from "@web3-react/types";
import { getDeprecatedInjection, getIsCoinbaseWallet, getIsInjected, getIsMetaMaskWallet } from "../constants/connectors/utils";
import { BROWSER_WALLET_ICON } from "../constants/icons";
import { WalletActivateParams } from "../types";
import { isMobile } from "../utils/userAgent";
import { deprecatedInjectedConnection, magic, walletConnectV2Connection } from './connections';
import { MagicLoginType } from "./magic";


//@dev https://github.com/Uniswap/interface/blob/main/src/connection/index.ts
const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet()
const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet()
const getIsGenericInjector = () => getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet();
const getIsInjectedMobileBrowser = () => getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser()

export const WALLET_CONNECTORS: {
  id: WalletActivateParams['connectorName'];
  name: string;
  icon: string;
  connector: Connector,
  loginType?: MagicLoginType;
  overrideActivate?: (chainId?: number) => boolean;
  shouldDisplay: () => boolean;
}[] = [
    {
      id: "metamask",
      name: getDeprecatedInjection()?.name || 'Browser Wallet',
      connector: deprecatedInjectedConnection.connector,
      icon: getDeprecatedInjection()?.icon || '"https://raw.githubusercontent.com/DexKit/assets/main/metamask-fox.svg"',
      shouldDisplay: () => deprecatedInjectedConnection.shouldDisplay(),
    },
    {
      id: "walletConnect",
      name: "Wallet Connect",
      connector: walletConnectV2Connection.connector,
      overrideActivate: walletConnectV2Connection.overrideActivate,
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/walletconnect-circle-blue.svg",
      shouldDisplay: () => walletConnectV2Connection.shouldDisplay(),
    },
    /* {
       id: "coinbase",
       name: "Coinbase",
       connector: coinbaseWalletConnection.connector,
       icon: COINBASE_WALLET_ICON,
       shouldDisplay: () => coinbaseWalletConnection.shouldDisplay(),
     },*/
    {
      id: "magic",
      name: "Google",
      connector: magic,
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/google-icon.svg",
      loginType: "google",
      shouldDisplay: () => !getIsInjectedMobileBrowser(),
    },
    {
      id: "magic",
      name: "Twitter",
      connector: magic,
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/twitter-logo.svg",
      loginType: "twitter",
      shouldDisplay: () => !getIsInjectedMobileBrowser(),
    },
    {
      id: "magic",
      name: "Discord",
      connector: magic,
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/discord-logo.svg",
      loginType: "discord",
      shouldDisplay: () => !getIsInjectedMobileBrowser(),
    },
  ];




export function GET_CONNECTOR_NAME(connector: any) {
  /* if (connector instanceof MetaMask) return 'MetaMask';
   if (connector instanceof WalletConnect) return 'WalletConnect';
   // if (connector instanceof CoinbaseWallet) return 'Coinbase';
   if (connector instanceof Connector) {
     if (typeof window !== "undefined") {
       const loginType = localStorage.getItem("loginType");
       const name = WALLET_CONNECTORS.find(w => w.id === 'magic' && w.loginType === loginType)?.name;
       if (name) {
         return name;
       }
     }
   }*/
  return 'Unknown';
}

export function GET_WALLET_ICON() {
  /*if (connector instanceof MetaMask) return METAMASK_ICON;
  if (connector instanceof WalletConnect) return WALLET_CONNECT_ICON;
  // if (connector instanceof CoinbaseWallet) return COINBASE_WALLET_ICON;
  if (connector instanceof Connector) {
    if (typeof window !== "undefined") {
      const loginType = localStorage.getItem("loginType");
      const icon = WALLET_CONNECTORS.find(w => w.id === 'magic' && w.loginType === loginType)?.icon;
      if (icon) {
        return icon;
      }
    }
  }*/


  return BROWSER_WALLET_ICON;
}