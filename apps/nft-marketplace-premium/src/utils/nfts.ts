import { ChainId } from '@dexkit/core/constants';


import { getNetworkSlugFromChainId } from '@dexkit/core/utils/blockchain';
import { MARKETPLACES, MARKETPLACES_INFO } from '@dexkit/ui/modules/nft/constants/marketplaces';
import { NETWORK_ID } from '../constants/enum';
import { Asset } from '../types/nft';





export function getMarketplaceForAssetURL(platform: MARKETPLACES, asset?: Asset) {
  if (platform === MARKETPLACES.OPEN_SEA && asset?.chainId !== ChainId.Fantom) {
    const openSeaInfo = MARKETPLACES_INFO[MARKETPLACES.OPEN_SEA];
    const networkSlug = getNetworkSlugFromChainId(asset?.chainId) as NETWORK_ID;
    //@ts-ignore
    const net = networkSlug ? openSeaInfo.networkMapping[networkSlug] : ''

    return `${openSeaInfo.baseAssetUrl}${net}/${asset?.contractAddress}/${asset?.id}`
  }
  if (platform === MARKETPLACES.LOOKS_RARE && asset?.chainId !== ChainId.Ethereum) {
    const marketplaceInfo = MARKETPLACES_INFO[MARKETPLACES.LOOKS_RARE];
    return `${marketplaceInfo.baseAssetUrl}${asset?.contractAddress}/${asset?.id}`
  }

  if (platform === MARKETPLACES.SUDOSWAP && asset?.chainId !== ChainId.Ethereum) {
    const marketplaceInfo = MARKETPLACES_INFO[MARKETPLACES.SUDOSWAP];
    return `${marketplaceInfo.baseAssetUrl}${asset?.contractAddress}/${asset?.id}`
  }

  if (platform === MARKETPLACES.RARIBLE && (asset?.chainId === ChainId.Ethereum || asset?.chainId === ChainId.Polygon)) {
    const marketplaceInfo = MARKETPLACES_INFO[MARKETPLACES.RARIBLE];
    const networkSlug = getNetworkSlugFromChainId(asset?.chainId) as any;
    //@ts-ignore
    const net = networkSlug ? marketplaceInfo.networkMapping[networkSlug] : ''
    return `${marketplaceInfo.baseAssetUrl}${net}/${asset?.contractAddress}:${asset?.id}`
  }




}

