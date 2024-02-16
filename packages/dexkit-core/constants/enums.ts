export enum ChainId {
  Ethereum = 1,
  Ropsten = 3,
  BSC = 56,
  Polygon = 137,
  Avax = 43114,
  Fantom = 250,
  Mumbai = 80001,
  Optimism = 10,
  Base = 8453,
  Arbitrum = 42161,
  Celo = 42220,
  Goerli = 5,
  BlastSepolia = 168587773
}

export enum TransactionStatus {
  Pending,
  Failed,
  Confirmed,
}

export enum CoinTypes {
  EVM_NATIVE = 'evm-native',
  EVM_ERC20 = 'evm-erc20',
  BITCOIN_NATIVE = 'bitcoin',
  SOLANA_NATIVE = 'solana-native',
}


export enum TransactionType {
  APPROVE,
  APPROVAL_FOR_ALL,
  WRAP,
  BUY,
  ACCEPT,
  CANCEL,
  MAKE_OFFER,
  SWAP,
}
