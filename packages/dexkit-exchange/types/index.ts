import { Token } from "@dexkit/core/types";

export type DexkitExchangeContextState = {
  zrxApiKey?: string;
  quoteToken?: Token;
  baseToken?: Token;
};
