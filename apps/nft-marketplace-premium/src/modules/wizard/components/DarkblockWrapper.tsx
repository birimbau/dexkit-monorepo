import { useWeb3React } from '@web3-react/core';
import dynamic from 'next/dynamic';

const PolygonDarkblockWidget = dynamic(
  // @ts-ignore
  async () =>
    // @ts-ignore
    (await import('@darkblock.io/matic-widget')).PolygonDarkblockWidget,
  { ssr: false }
);

const EthereumDarkblockWidget = dynamic(
  // @ts-ignore
  async () =>
    // @ts-ignore
    (await import('@darkblock.io/eth-widget')).EthereumDarkblockWidget,
  { ssr: false }
);

const AvalancheDarkblockWidget = dynamic(
  // @ts-ignore
  async () =>
    // @ts-ignore
    (await import('@darkblock.io/avax-widget')).AvalancheDarkblockWidget,
  { ssr: false }
);

export interface DarkBlockWrapperProps {
  address: string;
  tokenId: string;
  network: string;
}

export default function DarkblockWrapper({
  address,
  tokenId,
  network,
}: DarkBlockWrapperProps) {
  const { provider } = useWeb3React();

  if (typeof window !== 'undefined' && provider) {
    if (network === 'polygon') {
      return (
        <PolygonDarkblockWidget
          // @ts-ignore
          contractAddress={address as string}
          tokenId={tokenId}
          w3={provider?.provider}
          cb={(p: any) => console.log(p)}
        />
      );
    } else if (network === 'ethereum') {
      return (
        <EthereumDarkblockWidget
          // @ts-ignore
          contractAddress={address as string}
          tokenId={tokenId}
          w3={provider?.provider}
          cb={(p: any) => console.log(p)}
        />
      );
    } else if (network === 'avalanche') {
      return (
        <AvalancheDarkblockWidget
          // @ts-ignore
          contractAddress={address as string}
          tokenId={tokenId}
          w3={provider?.provider}
          cb={(p: any) => console.log(p)}
        />
      );
    }
  }

  return null;
}
