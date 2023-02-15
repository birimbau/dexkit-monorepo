import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TransactionStatus } from "../../constants/enum";
import { AppState, Token, Transaction } from "../../types";

export const appStateAtom = atomWithStorage<AppState>("appState", {
  transactions: {},
});

export const transactionsAtom = atomWithStorage<{ [key: string]: Transaction }>(
  "transactions",
  {}
);

export const pendingTransactionsAtom = atom<any, any>(
  (get) => {
    const transactions: any = get(transactionsAtom);

    let pendingTxs: { [hash: string]: Transaction } = {};

    if (transactions) {
      for (const hash of Object.keys(transactions)) {
        if (transactions[hash].status === TransactionStatus.Pending) {
          pendingTxs[hash] = transactions[hash];
        }
      }
    }

    return pendingTxs;
  },
  (get, set, arg) => {
    return set(transactionsAtom, arg);
  }
);

export const uncheckedTransactionsAtom = atom((get) => {
  const transactions: { [key: string]: Transaction } = get(transactionsAtom);

  if (transactions) {
    return Object.keys(transactions)
      .map((key) => transactions[key])
      .filter((t) => !t.checked);
  }

  return [];
});

export const hasPendingTransactionsAtom = atom(
  (get) => Object.keys(get(pendingTransactionsAtom)).length > 0
);

export const walletConnectorAtom = atomWithStorage<string | undefined>(
  "connector",
  undefined
);

export const showTransactionsAtom = atom<boolean>(false);

export const showConnectWalletAtom = atom<boolean>(false);

export const currencyAtom = atomWithStorage<string | undefined>(
  "currency",
  "usd"
);

export const recentTokensAtom = atomWithStorage<
  { token: Token; count: number }[]
>("recentTokens", []);
