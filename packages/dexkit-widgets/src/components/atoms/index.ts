import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const walletConnectorAtom = atomWithStorage<string | undefined>(
  "connector",
  undefined
);

export const showConnectWalletAtom = atom<boolean>(true);

export const currencyAtom = atomWithStorage<string | undefined>(
  "currency",
  "usd"
);
