import { ChainId } from '@dexkit/core/constants';
import { Row, Value } from '@react-page/editor';
import { UserFacingFeeStruct } from '@traderxyz/nft-swap-sdk';

import { BigNumber } from 'ethers';
import { NETWORK_ID } from '../constants/enum';
import { MARKETPLACES, MARKETPLACES_INFO } from '../constants/marketplaces';
import { Asset, AssetAPI, AssetBalance, AssetMetadata } from '../types/nft';
import { getNetworkSlugFromChainId } from './blockchain';

export function calculeFees(
  amount: BigNumber,
  decimals: number,
  fees: { amount_percentage: number; recipient: string }[]
): UserFacingFeeStruct[] {
  let tempFees: UserFacingFeeStruct[] = [];

  for (let fee of fees) {
    tempFees.push({
      amount: amount
        .mul((fee.amount_percentage * 100).toFixed(0))
        .div(10000)
        .toString(),
      recipient: fee.recipient,
    });
  }

  return tempFees;
}

export function truncateErc1155TokenId(id?: string) {
  if (id === undefined) {
    return '';
  }
  if (id.length < 12) {
    return id;
  }

  return `${String(id).substring(0, 6)}...${String(id).substring(id.length - 6, id.length)}`;
}

export function getNFTMediaSrcAndType(address: string, chainId: ChainId, tokenId: string, metadata?: AssetMetadata): { type: 'iframe' | 'image' | 'gif' | 'mp4', src?: string } {

  if (address.toLowerCase() === '0x5428dff180837ce215c8abe2054e048da311b751' && chainId === ChainId.Polygon) {
    return { type: 'iframe', src: `https://arpeggi.io/player?type=song&token=${tokenId}` }
  }
  if (metadata && metadata.animation_url) {
    return { type: 'mp4' };
  }

  return { type: 'image' }
}


export function isENSContract(address: string) {
  if (address.toLowerCase() === '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'.toLowerCase()) {
    return true;
  } else {
    false;
  }

}

export function getAssetProtocol(asset?: Asset) {
  return asset?.protocol === 'ERC1155' ? 'ERC1155' : 'ERC721';
}

export function isERC1155Owner(assetBalance?: AssetBalance) {
  return assetBalance?.balance?.gt(0) && assetBalance.asset.protocol === 'ERC1155'
}

export function parseAssetApi(assetApi?: AssetAPI): Asset | undefined {
  if (!assetApi) {
    return;
  }

  const rawMetadata = assetApi.rawData
    ? JSON.parse(assetApi.rawData)
    : undefined;
  const newAsset: Asset = {
    id: assetApi.tokenId,
    chainId: assetApi.chainId as ChainId,
    contractAddress: assetApi.address,
    tokenURI: assetApi.tokenURI || '',
    collectionName: assetApi.collectionName || '',
    symbol: assetApi.symbol || '',
    metadata: { ...rawMetadata, image: assetApi?.imageUrl },
    protocol: assetApi.protocol
  };
  return newAsset
}


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

export function returnNFTmap({ address, tokenId, chainId, currentMap }: { address: string, tokenId: string, chainId?: number, currentMap?: Map<number, Map<string, Set<string>>> }) {
  let assetsToFetch;
  if (currentMap) {
    assetsToFetch = currentMap;
  } else {
    assetsToFetch = new Map<number, Map<string, Set<string>>>()
  }

  if (chainId && assetsToFetch.has(chainId)) {
    const collectionMap = assetsToFetch.get(chainId)
    if (collectionMap) {
      if (collectionMap.has(address.toLowerCase())) {
        const tokenIdSet = collectionMap.get(address.toLowerCase());

        if (tokenIdSet) {
          tokenIdSet?.add(tokenId)
          collectionMap.set(address.toLowerCase(), tokenIdSet)
          assetsToFetch.set(chainId, collectionMap)
        } else {
          const tokenIdSet = new Set<string>()
          tokenIdSet.add(tokenId)
          collectionMap.set(address.toLowerCase(), tokenIdSet)
          assetsToFetch.set(chainId, collectionMap)
        }
      } else {
        const tokenIdSet = new Set<string>()
        tokenIdSet.add(tokenId)
        collectionMap.set(address.toLowerCase(), tokenIdSet);
        assetsToFetch.set(chainId, collectionMap)
      }
    } else {
      const collectionMap = new Map();
      const tokenIdSet = new Set<string>()
      tokenIdSet.add(tokenId)
      collectionMap.set(address.toLowerCase(), tokenIdSet);
      assetsToFetch.set(chainId, collectionMap)
    }
  } else {
    if (chainId) {
      const collectionMap = new Map();
      const tokenIdSet = new Set<string>()
      tokenIdSet.add(tokenId)
      collectionMap.set(address.toLowerCase(), tokenIdSet);
      assetsToFetch.set(chainId, collectionMap)
    }
  }

  return assetsToFetch;


}


function ParseRow({ rows, acc }: { rows: Row[], acc: any[] }) {
  for (const row of rows) {
    for (const cell of row.cells) {
      if (cell.plugin && cell.plugin.id === 'nft-plugin') {
        const data = cell.dataI18n;
        if (data) {
          acc.push(data['default']);
        }
      }
      if (cell.rows) {
        ParseRow({ rows: cell.rows, acc })
      }
    }
  }
}

interface NFTItem {
  contractAddress: string,
  network: string,
  id: string
}


export function parseNFTPageEditorConfig({ config }: { config: Value }): NFTItem[] {
  const rows = config.rows
  let acc: any = [];
  ParseRow({ rows, acc });
  return acc;
}

/**
 * We create here the where query to send to server to get multiple nfts at once;
 * @param param0 
 */
export function getWhereNFTQuery({ mapData }: { mapData: Map<number, Map<string, Set<string>>> }) {
  const whereQuery: any = {}
  whereQuery.where = {};
  whereQuery.where.OR = [];

  for (const networkData of mapData) {
    const chainId = Number(networkData[0]);
    const contractAddressMap = networkData[1];
    for (const contractData of contractAddressMap) {
      whereQuery.where.OR.push({
        chainId,
        address: contractData[0],
        tokenId: { in: Array.from(contractData[1]) }
      })
    }

  }
  return whereQuery;



}