import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TxDialogTransaction } from "./types";

export const selectedWalletAtom = atomWithStorage<string>("selectedWallet", "");

export const showTxDialogAtom = atom(false);
export const txDialogTransactionsAtom = atom<TxDialogTransaction[]>([]);
export const txDialogLoading = atom(false);
