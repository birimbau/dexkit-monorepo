import { atomWithStorage } from "jotai/utils";

export const maxSlippageAtom = atomWithStorage<number>("maxSlippage", 0.0);
export const isAutoSlippageAtom = atomWithStorage<boolean>(
  "isAutoSlippage",
  true
);
