import moment from "moment";
import { Currency, Language } from "../types/app";

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

export const LANGUAGES: Language[] = [
  { name: 'English (US)', locale: 'en-US' },
  { name: 'Português (BR)', locale: 'pt-BR' },
  { name: 'Español (ES)', locale: 'es-ES' },
];

export const CURRENCIES: Currency[] = [
  { symbol: 'usd', name: 'US Dollar' },
  { symbol: 'eur', name: 'Euro' },
  { symbol: 'brl', name: 'Brazil Real' },
  { symbol: 'inr', name: 'Indian Rupee' },
  { symbol: 'czk', name: 'Czech Koruna' },
  { symbol: 'ars', name: 'Argentine Peso' },
  { symbol: 'chf', name: 'Swiss Franc' },
  { symbol: 'clp', name: 'Chilean Peso' },
  { symbol: 'vef', name: 'Venezuelan bolívar fuerte' },
  { symbol: 'ngn', name: 'Nigerian Naira' },
];

export const MIN_KIT_HOLDING_AI_GENERATION = '1000';

export const MAX_ACCOUNT_FILE_UPLOAD_SIZE = 2048576;

export const DEXKIT_AUTHENTICATE_API_KEY = process?.env?.MARKETPLACE_API_KEY
  ? process?.env?.MARKETPLACE_API_KEY
  : '';