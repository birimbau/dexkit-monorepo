
import { Connector } from "@web3-react/types";
import { getDeprecatedInjection, getIsCoinbaseWallet, getIsInjected, getIsMetaMaskWallet } from "../constants/connectors/utils";
import { COINBASE_WALLET_ICON } from "../constants/icons";
import { WalletActivateParams } from "../types";
import { isMobile } from "../utils/userAgent";
import { coinbaseWalletConnection, deprecatedInjectedConnection, magic, walletConnectV2Connection } from './connections';
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
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/walletconnect-circle-blue.svg",
      shouldDisplay: () => walletConnectV2Connection.shouldDisplay(),
    },
    {
      id: "coinbase",
      name: "Coinbase",
      connector: coinbaseWalletConnection.connector,
      icon: COINBASE_WALLET_ICON,
      shouldDisplay: () => coinbaseWalletConnection.shouldDisplay(),
    },
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




