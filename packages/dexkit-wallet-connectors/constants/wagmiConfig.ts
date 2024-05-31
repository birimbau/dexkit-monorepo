import { createConfig, http } from 'wagmi'
import { arbitrum, avalanche, base, bsc, fantom, mainnet, optimism, polygon, polygonAmoy, sepolia } from 'wagmi/chains'

import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygon, polygonAmoy, bsc, fantom, avalanche, base, optimism, arbitrum],
  connectors: [injected(), coinbaseWallet(), walletConnect({ projectId: '' })],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [fantom.id]: http(),
    [avalanche.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [polygonAmoy.id]: http()
  },
})