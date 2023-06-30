import { Asset } from "@dexkit/core/types/nft";
import { atomWithStorage } from "jotai/utils/atomWithStorage";



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

export const localeUserAtom = atomWithStorage<string>('dexkit-ui.user-app-locale', 'en-usd');
