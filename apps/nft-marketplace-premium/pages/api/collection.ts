import { getProviderByChainId } from '@dexkit/core/utils/blockchain';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getCollectionData
} from '../../src/services/nft';
import { Collection } from '../../src/types/nft';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chainId, contractAddress } = req.query;

  const provider = getProviderByChainId(parseInt(chainId as string));

  const collection: Collection | undefined = await getCollectionData(
    provider,
    contractAddress as string
  );

  if (!collection) {
    return res.status(404).end();
  }

  return res.json(collection);
}
