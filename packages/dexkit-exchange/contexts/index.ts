import React from "react";
import { DexkitExchangeContextState } from "../types";

export const DexkitExchangeContext =
  React.createContext<DexkitExchangeContextState>({
    setPair: () => {},
    baseTokens: [],
    quoteTokens: [],
    availNetworks: [],
  });
