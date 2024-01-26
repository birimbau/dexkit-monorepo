import { dexkitNFTapi } from '@dexkit/ui/constants/api';
import { getActiveNetworksObject } from '@dexkit/ui/services/app';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getAssetData,
  getAssetDexKitApi,
  getAssetMetadata,
} from '../../src/services/nft';
import { Asset } from '../../src/types/nft';
import { getChainSlug, getProviderByChainId } from '../../src/utils/blockchain';

// TODO: Fix this (add siteId)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let asset: Asset | undefined;
  const { chainId, contractAddress, tokenId, siteId } = req.query;

  const NETWORKS = await getActiveNetworksObject({
    instance: dexkitNFTapi,
    siteId: parseInt(siteId as string),
  });

  try {
    const provider = getProviderByChainId(
      parseInt(chainId as string),
      NETWORKS,
    );

    await provider?.ready;

    asset = await getAssetData(
      provider,
      contractAddress as string,
      tokenId as string,
      undefined,
      undefined,
      NETWORKS,
    );
  } catch (e) {
    console.log(e);
  }

  if (!asset) {
    return res.status(404).end();
  }
  try {
    const assetAPI = await getAssetDexKitApi({
      networkId: getChainSlug(parseInt(chainId as string), NETWORKS) as string,
      contractAddress: contractAddress as string,
      tokenId: tokenId as string,
    });
    if (assetAPI) {
      if (assetAPI.rawData) {
        const metadata = JSON.parse(assetAPI.rawData);
        return res.json({
          ...asset,
          metadata: {
            ...metadata,
            image: assetAPI.imageUrl,
          },
        });
      }
    }
  } catch (e) {
    console.log(e);
    console.log('failed fetching from api');
  }

  const metadata = await getAssetMetadata(asset?.tokenURI, {
    image: '',
    name: `${asset.collectionName} #${asset.id}`,
  });

  return res.json({ ...asset, metadata });
}
