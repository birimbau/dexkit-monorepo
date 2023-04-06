import { TransactionType } from "@dexkit/core/constants";
import { AppTransaction, Token, Transaction, TransactionMetadata } from "@dexkit/core/types";
import { AppNotification } from "@dexkit/ui/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const transactionsAtom = atom<{ [key: string]: Transaction } | undefined>(undefined);



export const isConnectWalletOpenAtom = atom(false);
export const transactionDialogOpenAtom = atom(false);
export const transactionDialogHashAtom = atom<string | undefined>(undefined);
export const transactionDialogErrorAtom = atom<Error | undefined>(undefined);
export const transactionDialogMetadataAtom = atom<
  TransactionMetadata | undefined
>(undefined);

/** @deprecated */
export const transactionDialogTypeAtom = atom<TransactionType | undefined>(
  undefined
);

export const transactionValuesAtom = atom<Record<string, any> | undefined>(
  undefined
);

export const transactionTypeAtom = atom<string | undefined>(undefined);

export const switchNetworkOpenAtom = atom(false);
export const switchNetworkChainIdAtom = atom<number | undefined>(undefined);

export const transactionDialogRedirectUrlAtom = atom<string | undefined>(
  undefined
);


export const selectedWalletAtom = atomWithStorage<string>('connector', '');

export const transactionsAtomV2 = atomWithStorage<{
  [key: string]: AppTransaction;
}>('dexkit.transactions', {});

export const notificationsAtom = atomWithStorage<AppNotification[]>(
  'dexkit.notifications',
  []
);

export const recentTokensAtom = atomWithStorage<
  { token: Token; count: number }[]
>("recentTokens", []);
