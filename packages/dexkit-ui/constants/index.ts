import moment from "moment";

export const MIN_ORDER_DATE_TIME = moment.duration(1, 'hour');

export const WHITELISTED_IMAGE_DOMAINS = [
  'i.seadn.io',
  'dweb.link',
  'ipfs.io',
  'ipfs.moralis.io',
  'dashboard.mypinata.cloud',
  'raw.githubusercontent.com',
  'arpeggi.io',
  'arweave.net',
  'i.ibb.co',
  // 'metadata.ens.domains',
  'assets.otherside.xyz',
  'dexkit-storage.nyc3.cdn.digitaloceanspaces.com',
  'dexkit-storage.nyc3.digitaloceanspaces.com',
];

export const DEXKIT_BASE_FILES_HOST =
  'https://dexkit-storage.nyc3.digitaloceanspaces.com';