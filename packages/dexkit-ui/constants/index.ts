import { MagicLoginType } from "@dexkit/core/constants";
import { WalletActivateParams } from "@dexkit/core/types";

export const WALLET_CONNECTORS: {
  id: WalletActivateParams['connectorName'];
  name: string;
  icon: string;
  loginType?: MagicLoginType;
}[] = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/metamask-fox.svg",
    },
    {
      id: "walletConnect",
      name: "Wallet Connect",
      icon: "https://raw.githubusercontent.com/DexKit/assets/main/walletconnect-circle-blue.svg",
    },
    // {
    //   id: "magic",
    //   name: "Google",
    //   icon: "https://raw.githubusercontent.com/DexKit/assets/main/google-icon.svg",
    //   loginType: "google",
    // },
    // {
    //   id: "magic",
    //   name: "Twitter",
    //   icon: "https://raw.githubusercontent.com/DexKit/assets/main/twitter-logo.svg",
    //   loginType: "twitter",
    // },
  ];
