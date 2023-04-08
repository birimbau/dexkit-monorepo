import { AppPageOptions } from "../../../types/config";
import { SectionMetadata } from "../types/section";

export const MAX_FEES = 10;

export const UNISWAP_DEFAULT_TOKENLIST_URL = 'https://tokens.uniswap.org/';
export const GEMINI_TOKENLIST_URL =
  'https://www.gemini.com/uniswap/manifest.json';

export const DEXKIT_TOKENLIST_URL = 'https://raw.githubusercontent.com/DexKit/dexkit-token-list/main/build/dexkit.tokenlist.json'

export const WIZARD_MAX_TOKENS = 60;

export const WIZARD_SWAP_MAX_FEES = 10;

export const KITTYGOTCHI_CONTRACT =
  '0xEA88540adb1664999524d1a698cb84F6C922D2A1';

export const HELP_FIELD_TEXT = {
  name: 'Name of your Marketplace.',
  email: 'Email used to receive notifications about your Marketplace.',
  domain: 'Domain used to deploy your Marketplace. Make sure you own this domain and that is not in use. If in use remove all records on it.',
  'favicon.url': 'Image Url for the favicon used by your application. {br} Recomended size: 20x20px',
  'logo.url': 'Image Url for the logo used by your application. {br} Recomended size: 150x150px',
  'custom.primary.color': 'Primary color',
  'custom.secondary.color': 'Secondary color',
  'custom.background.default.color': 'Background color',
  'custom.text.primary.color': 'Text color'
}

export const CORE_PAGES: { [key: string]: AppPageOptions } = {
  ['swap']: {
    title: 'Swap',
    uri: '/swap'
  },
  ['collections']: {
    title: 'Collections',
    uri: '/collections'
  },
  ['wallet']: {
    title: 'Wallet',
    uri: '/wallet'
  }
}


export enum BuilderKit {
  ALL = 'All KITs',
  NFT = 'NFT KITs',
  Swap = 'Swap KITs',

}



export const SectionsMetadata: SectionMetadata[] = [
  {
    type: 'video',
    title: 'Video',
    icon: 'videocam'
  }


]