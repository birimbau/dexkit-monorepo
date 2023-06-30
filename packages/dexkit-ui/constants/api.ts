import axios from 'axios';
import { AssetAPI } from '../modules/nft/types';
import { getAccessToken } from '../services/auth';

export const DEXKIT_BASE_API_URL = 'https://nft-api.dexkit.com'

export const DEXKIT_NFT_BASE_URL = `${DEXKIT_BASE_API_URL}`



export const TRADER_ORDERBOOK_API = 'https://api.trader.xyz/orderbook/orders';

export const ENS_BASE_URL = 'https://metadata.ens.domains';

export const metadataENSapi = axios.create({ baseURL: ENS_BASE_URL });

const DEXKIT_DASH_ENDPOINT = `${DEXKIT_BASE_API_URL}`;

export const dexkitNFTapi = axios.create({ baseURL: DEXKIT_NFT_BASE_URL, timeout: 2500 });

export const myAppsApi = axios.create({
  baseURL: DEXKIT_DASH_ENDPOINT,
  headers: { 'content-type': 'application/json' },
});


myAppsApi.interceptors.request.use(async (config) => {
  const access_token = await getAccessToken();
  if (access_token)
    config.headers = {
      ...config.headers,
      authorization: `Bearer ${access_token}`,
    };
  return config;
});

export async function getAssetDexKitApi({
  networkId,
  contractAddress,
  tokenId,
}: {
  networkId: string;
  contractAddress: string;
  tokenId: string;
}) {

  const resp = await dexkitNFTapi.get<AssetAPI>(`/asset/${networkId}/${contractAddress.toLowerCase()}/${tokenId}`);
  // We replace it with the cdn image
  const imageUrl = resp.data.imageUrl?.replace('dexkit-storage.nyc3.digitaloceanspaces.com', 'dexkit-storage.nyc3.cdn.digitaloceanspaces.com');

  if (imageUrl) {
    return { ...resp.data, imageUrl };
  }
  return resp.data
}