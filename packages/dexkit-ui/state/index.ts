import { Asset } from "@dexkit/core/types/nft";
import { atomWithStorage } from "jotai/utils";
import { ThemeMode } from "../constants/enum";



export const accountAssetsAtom = atomWithStorage<{
  data?: { network?: string, assets?: Asset[], account?: string, total?: number, page?: number, perPage?: number; }[]
  lastTimeFetched?: {
    query: string,
    time: number
  }
}>('dexkit-ui:account-assets', {

  lastTimeFetched: {
    time: new Date().getTime(),
    query: '',
  },
}

);

export const userThemeModeAtom = atomWithStorage<ThemeMode | undefined>('dexkit-ui.user-theme-mode', undefined);

export const localeUserAtom = atomWithStorage<string>('dexkit-ui.user-app-locale', 'en-us');

export const currencyUserAtom = atomWithStorage<string>('dexkit-ui.user-currency', 'usd');

export const selectedWalletAtom = atomWithStorage<string>('dexkit-ui.connector', '');
