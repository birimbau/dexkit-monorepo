import { useQuery } from '@tanstack/react-query';
import { getCollectionAssetsDexKitApi } from "../services/nft";
import { Asset } from "../types/nft";
import { CollectionStatsRari } from "../types/rarible";




export const GET_ASSET_LIST_FROM_COLLECTION = 'GET_ASSET_LIST_FROM_COLLECTION';

interface Props {
  network: string,
  address: string,
  skip?: number;
  take?: number;
  traitsFilter?: string
}


export const useAssetListFromCollection = (params: Props) => {
  const { network, address, traitsFilter, skip, take } = params

  return useQuery(
    [GET_ASSET_LIST_FROM_COLLECTION, network, address, traitsFilter, skip, take],
    async () => {
      /* let traitsFilterString;
       if (traitsFilter) {
         traitsFilterString = traitsFilter.map(t => `${t.property}.${t.value}`);
         traitsFilterString = traitsFilterString.join(',')
       }*/
      const { data, total } = await getCollectionAssetsDexKitApi({ networkId: network, contractAddress: address, traitsFilter: traitsFilter, skip: skip, take })


      return {

        assets: data.map(asset => {
          let metadata: any = {};
          if (asset.rawData) {
            metadata = JSON.parse(asset.rawData);
          }
          if (asset.imageUrl) {
            metadata.image = asset.imageUrl;
          }
          return {
            contractAddress: asset.address,
            id: String(asset.tokenId),
            chainId: asset.chainId,
            tokenURI: asset.tokenURI,
            collectionName: asset.collectionName,
            symbol: asset.symbol,
            metadata,
          };
        }) as Asset[],
        skip,
        take,
        total
      };

    }
  );
};

export const GET_COLLECTION_STATS = 'GET_COLLECTION_STATS';

interface CollectionStatsProps {
  network?: string,
  address?: string,
}

export const useCollectionStats = (params: CollectionStatsProps) => {
  const { network, address } = params

  return useQuery<CollectionStatsRari | undefined>(
    [GET_COLLECTION_STATS, network, address],
    async () => {
      return undefined
    }, { enabled: false }

  );
};