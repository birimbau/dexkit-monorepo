

export const getIsInjected = () => typeof window !== "undefined" ? Boolean(window.ethereum) : false

// When using Brave browser, `isMetaMask` is set to true when using the built-in wallet
// This variable should be true only when using the MetaMask extension
// https://wallet-docs.brave.com/ethereum/wallet-detection#compatability-with-metamask
type NonMetaMaskFlag = 'isRabby' | 'isBraveWallet' | 'isTrustWallet' | 'isLedgerConnect'
const allNonMetamaskFlags: NonMetaMaskFlag[] = ['isRabby', 'isBraveWallet', 'isTrustWallet', 'isLedgerConnect']
export const getIsMetaMaskWallet = () => typeof window !== "undefined" ? Boolean(window.ethereum?.isMetaMask && !allNonMetamaskFlags.some((flag) => (window.ethereum as any)?.[flag])) : false;

export const getIsCoinbaseWallet = () => typeof window !== "undefined" ? Boolean((window.ethereum as any)?.isCoinbaseWallet) : false;

// https://eips.ethereum.org/EIPS/eip-1193#provider-errors
export enum ErrorCode {
  USER_REJECTED_REQUEST = 4001,
  UNAUTHORIZED = 4100,
  UNSUPPORTED_METHOD = 4200,
  DISCONNECTED = 4900,
  CHAIN_DISCONNECTED = 4901,

  // https://docs.metamask.io/guide/rpc-api.html#unrestricted-methods
  CHAIN_NOT_ADDED = 4902,
  MM_ALREADY_PENDING = -32002,

  WC_MODAL_CLOSED = 'Error: User closed modal',
  CB_REJECTED_REQUEST = 'Error: User denied account authorization',
}

