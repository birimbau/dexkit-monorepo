import { MetaMask } from '@web3-react/metamask';

import { ChainId } from '@dexkit/core/constants';

import { Network } from '@dexkit/core/types';
import { ethers } from 'ethers';

export const getNetworks = ({
  includeTestnet,
  NETWORKS,
}: {
  includeTestnet: boolean;
  NETWORKS: { [key: number]: Network };
}) => {
  if (includeTestnet) {
    return Object.values(NETWORKS);
  } else {
    return Object.values(NETWORKS).filter((n) => !n.testnet);
  }
};

export const getNetworkFromSlug = (
  chainName?: string,
  NETWORKS?: { [key: number]: Network },
) => {
  if (!chainName || !NETWORKS) {
    return;
  }

  const keys = Object.keys(NETWORKS).map(Number);

  let key = keys.find((key) => NETWORKS[key].slug === chainName);

  if (key !== undefined) {
    return NETWORKS[key];
  }

  return undefined;
};

export const getNetworkFromName = (
  chainName: string,
  NETWORKS?: { [key: number]: Network },
) => {
  const keys = NETWORKS ? Object.keys(NETWORKS).map(Number) : [];

  let key = keys.find(
    (key) =>
      NETWORKS && NETWORKS[key].name.toLowerCase() === chainName?.toLowerCase(),
  );

  if (key !== undefined && NETWORKS) {
    return NETWORKS[key];
  }

  return undefined;
};

export const getNetworkSlugFromChainId = (
  chainId?: ChainId,
  NETWORKS?: { [key: number]: Network },
) => {
  if (chainId && NETWORKS) {
    return NETWORKS[chainId].slug;
  }
};

export const getProviderByChainId = (
  chainId?: ChainId,
  NETWORKS?: { [key: number]: Network },
) => {
  if (chainId && NETWORKS) {
    if (NETWORKS[chainId].providerRpcUrl) {
      return new ethers.providers.JsonRpcProvider(
        NETWORKS[chainId].providerRpcUrl,
      );
    }
  }
};

export const truncateAddress = (address: string | undefined) => {
  if (address !== undefined && ethers.utils.isAddress(address)) {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
  }
  return '';
};

export function isAddressEqual(address?: string, other?: string) {
  if (address === undefined || other === undefined) {
    return false;
  }

  if (!ethers.utils.isAddress(address) || !ethers.utils.isAddress(other)) {
    return false;
  }

  return address.toLowerCase() === other.toLowerCase();
}

export function getBlockExplorerUrl(
  chainId?: number,
  NETWORKS?: { [key: number]: Network },
) {
  if (chainId && NETWORKS) {
    return NETWORKS[chainId].explorerUrl;
  }
}

export function getNativeCurrencySymbol(
  chainId?: number,
  NETWORKS?: { [key: number]: Network },
) {
  if (chainId && NETWORKS) {
    return NETWORKS[chainId].coinSymbol || NETWORKS[chainId]?.symbol;
  }
}

export function getNativeCurrencyName(
  chainId?: number,
  NETWORKS?: { [key: number]: Network },
) {
  if (chainId && NETWORKS) {
    return NETWORKS[chainId]?.coinName || NETWORKS[chainId]?.name;
  }
}

export function getNativeCurrencyImage(
  chainId?: number,
  NETWORKS?: { [key: number]: Network },
) {
  if (chainId && NETWORKS) {
    return NETWORKS[chainId]?.imageUrl;
  }
}

export function getChainName(
  chainId?: number,
  NETWORKS?: { [key: number]: Network },
) {
  if (chainId && NETWORKS) {
    return NETWORKS[chainId]?.name || `0x${chainId.toString(16)}`;
  }
}

export function getChainSlug(
  chainId?: number,
  NETWORKS?: { [key: number]: Network },
) {
  if (chainId && NETWORKS) {
    return NETWORKS[chainId]?.slug;
  }
}

export function getChainSymbol(
  chainId?: number,
  NETWORKS?: { [key: number]: Network },
) {
  if (chainId && NETWORKS) {
    return NETWORKS[chainId]?.symbol;
  }
}

export function getChainLogoImage(
  chainId?: number,
  NETWORKS?: { [key: number]: Network },
) {
  if (chainId && NETWORKS) {
    return NETWORKS[chainId]?.imageUrl;
  }
}

export async function switchNetwork(
  connector: any,
  chainId: number,
  NETWORKS?: { [key: number]: Network },
) {
  if (connector instanceof MetaMask && NETWORKS) {
    if (chainId === ChainId.Arbitrum) {
      return connector.provider?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: NETWORKS[ChainId.Arbitrum].name,
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [NETWORKS[ChainId.Arbitrum].providerRpcUrl],
            blockExplorerUrls: [NETWORKS[ChainId.Arbitrum].explorerUrl],
          },
        ],
      });
    }

    return connector.provider?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  }
}
