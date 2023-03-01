import { atomWithStorage } from "jotai/utils";

export const walletConnectorAtom = atomWithStorage<string | undefined>(
  "connector",
  undefined
);
