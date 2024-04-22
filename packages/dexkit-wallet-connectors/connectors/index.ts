
//import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { BROWSER_WALLET_ICON, METAMASK_ICON, WALLET_CONNECT_ICON } from "../constants/icons";


import type { WalletId } from 'thirdweb/wallets';




export function GET_CONNECTOR_NAME(walletId?: WalletId) {
  if (walletId === 'io.metamask') return 'MetaMask';
  if (walletId === 'walletConnect') return 'WalletConnect';
  // if (connector instanceof CoinbaseWallet) return 'Coinbase';
  /*if (connector instanceof Connector) {
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

export function GET_WALLET_ICON(walletId?: WalletId) {
  if (!walletId) {
    return BROWSER_WALLET_ICON;
  }


  if (walletId === 'io.metamask') return METAMASK_ICON;
  if (walletId === 'walletConnect') return WALLET_CONNECT_ICON;
  // if (connector instanceof CoinbaseWallet) return COINBASE_WALLET_ICON;
  /* if (walletId === '') {
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