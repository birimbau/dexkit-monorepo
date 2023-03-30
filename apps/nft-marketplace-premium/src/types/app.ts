import { Token, Transaction } from './blockchain';
import { Asset } from './nft';

export interface AppState {
  transactions: { [hash: string]: Transaction };
  tokens: Token[];
  isBalancesVisible: boolean;
  currency: string;
  locale: string;
  currencyUser: string;
  localeUser: string;
  assets: { [key: string]: Asset };
  accountAssets: {
    data?: { network?: string, assets?: Asset[], account?: string, total?: number, page?: number, perPage?: number; }[]
    lastTimeFetched?: {
      query: string,
      time: number
    }
  };
  hiddenAssets: { [key: string]: boolean };
}

export interface Currency {
  symbol: string;
  name: string;
}

export interface Language {
  name: string;
  locale: string;
}
