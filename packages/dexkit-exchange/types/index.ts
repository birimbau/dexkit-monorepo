import { Token } from "@dexkit/core/types";

export type DexkitExchangeContextState = {
  zrxApiKey?: string;
  quoteToken?: Token;
  baseToken?: Token;
  baseTokens: Token[];
  quoteTokens: Token[];
  buyTokenPercentageFee?: number;
  feeRecipient?: string;
  tokens?: { [key: string]: Token };
  setPair: (baseToken: Token, quoteToken: Token) => void;
};

export type GtPool = {
  id: string;
  type: string;
  attributes: {
    base_token_price_usd: string;
    base_token_price_native_currency: string;
    quote_token_price_usd: string;
    quote_token_price_native_currency: string;
    address: string;
    name: string;
    reserve_in_usd: string;
    pool_created_at: null;
    token_price_usd: string;
    fdv_usd: string;
    market_cap_usd: string;
    price_change_percentage: {
      h1: string;
      h24: string;
    };
    transactions: {
      h1: {
        buys: number;
        sells: number;
      };
      h24: {
        buys: number;
        sells: number;
      };
    };
    volume_usd: {
      h24: string;
    };
  };
};

export type GtTopPoolsApiResponse = {
  data: GtPool[];
};
